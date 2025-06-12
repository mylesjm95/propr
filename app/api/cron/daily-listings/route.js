import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPropertyQuery } from '@/lib/odata';

// Vercel Cron Job endpoint
export const maxDuration = 300; // Set maximum execution duration to 300 seconds (5 minutes)

export async function GET(request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  
  if (process.env.VERCEL_ENV !== 'development') {
    // Only check for auth header in non-development environments
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
  
  // Record start time for execution stats
  const startTime = Date.now();
  
  // Initialize stats object
  const stats = {
    usersWithSearches: 0,
    searchesProcessed: 0,
    listingsFound: 0,
    emailsSent: 0,
    buildings: [],
    queriesRun: [],
    failedQueries: [],
    emailErrors: []
  };
  
  try {
    // Create timestamp for yesterday at midnight
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    // Create timestamp for today at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Format timestamps for OData query
    const startTimestamp = yesterday.toISOString().replace(/\\.\\d{3}Z$/, 'Z');
    const endTimestamp = today.toISOString().replace(/\\.\\d{3}Z$/, 'Z');
    
    // Log the time range we're checking
    console.log(`Checking for listings between ${startTimestamp} and ${endTimestamp}`);
    
    // Set the timestamp on stats object
    stats.timestamp = startTimestamp;
    stats.timeRange = {
      start: startTimestamp,
      end: endTimestamp
    };
    
    // Validate environment variables
    if (!process.env.TREB_TOKEN) {
      console.error('Missing TREB_TOKEN API key');
      return NextResponse.json({ success: false, error: 'Missing TREB API key' }, { status: 500 });
    }
    
    if (!process.env.RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY for email sending');
      return NextResponse.json({ success: false, error: 'Missing email service key' }, { status: 500 });
    }
    
    if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing Supabase URL configuration');
      return NextResponse.json({ success: false, error: 'Missing database configuration' }, { status: 500 });
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase service role key');
      return NextResponse.json({ success: false, error: 'Missing database access key' }, { status: 500 });
    }
    
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, 
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const resendKey = process.env.RESEND_API_KEY;
    
    // Fetch users with saved searches
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, saved_searches');

    if (usersError) {
      console.error('Database error when fetching users:', usersError);
      return NextResponse.json({ 
        success: false, 
        error: 'Database error when fetching users',
        details: usersError.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    if (!users || users.length === 0) {
      console.log('No users found in database');
      return NextResponse.json({ 
        success: true, 
        message: 'No users found to process',
        timestamp: new Date().toISOString()
      });
    }
    
    // Filter users with valid saved_searches
    const usersWithSearches = users.filter(user => {
      // Check if saved_searches exists, is not null, and is an array with elements containing building_address
      return user.saved_searches && 
             Array.isArray(user.saved_searches) && 
             user.saved_searches.length > 0 &&
             user.saved_searches.some(search => search && search.building_address);
    });
    
    // Update stats
    stats.usersWithSearches = usersWithSearches.length;

    for (const user of usersWithSearches) {
      const searches = user.saved_searches || [];
      if (!searches.length) {
        continue;
      }
      
      const allListings = [];

      for (const search of searches) {
        // Store buildingAddress outside try block so it's accessible in catch
        const buildingAddress = search.building_address;
        
        // Define these variables outside the try block
        let streetNumber = '';
        let streetName = '';
        
        try {
          if (!buildingAddress || typeof buildingAddress !== 'string') {
            continue;
          }
          
          // Split the address into street number and street name
          const addressParts = buildingAddress.split(' ');
          if (addressParts.length < 2) {
            // Skip addresses that don't have at least a number and street name
            continue;
          }
          
          streetNumber = addressParts[0].trim();
          // Ensure street number is numeric
          if (!streetNumber || isNaN(Number(streetNumber))) {
            continue;
          }
          
          const streetNameParts = addressParts.slice(1);
          
          // Extract just the street name without suffix (St, Ave, etc.) to match the working query pattern
          // This will convert "Cherry St" to just "Cherry" which works better with contains() function
          streetName = streetNameParts.join(' ').trim();
          
          // Remove common street suffixes to improve matching
          const streetSuffixes = [' St', ' Ave', ' Rd', ' Dr', ' Blvd', ' Cres', ' Pl', ' Way', ' Court', ' Lane'];
          for (const suffix of streetSuffixes) {
            if (streetName.toLowerCase().endsWith(suffix.toLowerCase())) {
              streetName = streetName.slice(0, streetName.length - suffix.length).trim();
              break;
            }
          }
          
          if (!streetNumber || !streetName || streetName.length < 2) {
            // Skip if we don't have valid parts or street name is too short
            continue;
          }
          
          // Define these variables outside the try block to make them available in catch
          let sanitizedStreetNumber = '';
          let sanitizedStreetName = '';
          
          try {
            // Use the OData utility to properly construct and execute the query
            const query = createPropertyQuery();
            
            if (!query) {
              console.error('Failed to create property query, TREB_TOKEN might be invalid');
              continue;
            }
            
            // Sanitize inputs to prevent injection in the OData query
            sanitizedStreetNumber = streetNumber.replace(/['"\\\\]/g, '');
            sanitizedStreetName = streetName.replace(/['"\\\\]/g, '');
            
            // Build filter for specifically yesterday's listings
            const filter = `StreetNumber eq '${sanitizedStreetNumber}' and contains(StreetName, '${sanitizedStreetName}') and ModificationTimestamp ge ${startTimestamp} and ModificationTimestamp lt ${endTimestamp}`;
            
            query.filter(filter)
                 .select([
                   'UnparsedAddress',
                   'ListPrice',
                   'MlsStatus',
                   'BedroomsTotal',
                   'BathroomsTotalInteger',
                   'LivingAreaRange',
                   'ParkingTotal',
                   'ListingKey',
                   'ModificationTimestamp',
                   'ListingContractDate',
                   'CloseDate',
                   'StreetNumber',
                   'StreetName',
                   'StreetSuffix',
                   'TransactionType',
                   'PropertyType',
                   'ContractStatus'
                 ])
                 .limit(20)
                 .orderBy('ModificationTimestamp', true); // true for descending (desc)

            // Execute the query with retry logic
            const result = await query.execute({ 
              cache: 'no-store',
              retries: 2,  // Retry up to 2 times
              initialDelay: 1000, // Start with 1 second delay
              maxDelay: 3000 // Max 3 second delay
            });
            
            // Track individual query stats for debugging
            const queryStats = {
              address: buildingAddress,
              streetNumber: sanitizedStreetNumber || streetNumber,
              streetName: sanitizedStreetName || streetName,
              results: 0
            };
            
            if (!result) {
              console.error(`API returned empty result for ${buildingAddress}`);
            } else if (!Array.isArray(result.value)) {
              console.error(`Unexpected API response format for ${buildingAddress}:`, 
                typeof result.value === 'object' ? JSON.stringify(result.value).substring(0, 100) + '...' : typeof result.value);
            } else {
              queryStats.results = result.value.length;
              
              // Filter out any invalid listings (missing crucial data)
              const validListings = result.value.filter(listing => {
                return listing && 
                      listing.ListingKey && 
                      listing.UnparsedAddress && 
                      listing.ListPrice;
              });
              
              if (validListings.length > 0) {
                allListings.push(...validListings);
              }
            }
            
            // Add to stats for reporting
            stats.queriesRun = stats.queriesRun || [];
            stats.queriesRun.push(queryStats);
          } catch (err) {
            console.error(`TREB fetch error for ${buildingAddress || 'unknown address'}:`, err.message);
            
            // Track failed queries in stats
            stats.failedQueries = stats.failedQueries || [];
            stats.failedQueries.push({
              address: buildingAddress || 'unknown address',
              error: err.message
            });
          }
        } catch (parseError) {
          console.error(`Error parsing address "${search.building_address}":`, parseError.message);
          continue;
        }
      }

      if (!allListings.length) {
        continue;
      }
      
      // Update the listings counter in stats
      stats.listingsFound += allListings.length;

      // Generate HTML for listings with error handling
      const listingsHtml = allListings
        .map((l) => {
          try {
            // Format price with validation
            const priceFormatted = l.ListPrice ? `$${Number(l.ListPrice).toLocaleString()}` : 'Price not available';
            
            return `<li>
              <strong>${l.UnparsedAddress || 'Address not available'}</strong> - ${l.MlsStatus || 'Status not available'} (${priceFormatted})
              <br>Beds: ${l.BedroomsTotal || 'N/A'} | Baths: ${l.BathroomsTotalInteger || 'N/A'} | Area: ${l.LivingAreaRange || 'N/A'} | Parking: ${l.ParkingTotal || 'N/A'}
            </li>`;
          } catch (formatError) {
            console.error('Error formatting listing for email:', formatError);
            return '<li>Error formatting listing</li>';
          }
        })
        .join('');

      // Create a date-formatted timestamp for the subject line
      const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      
      // Format yesterday's date for email subject
      const yesterdayStr = yesterday.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      
      const emailBody = `
        <h2>Your Daily Condo Listings Update</h2>
        <p>New listings for your saved condo buildings from ${yesterdayStr}:</p>
        <ul>${listingsHtml}</ul>
        <p><a href="https://skyscrapr.com/settings">Manage your subscriptions</a></p>
      `;

      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'listings@proprmarketing.co',
            to: user.email,
            subject: `Daily Listings Update for ${yesterdayStr} - ${allListings.length} New Listings`,
            html: emailBody,
          }),
        });
        
        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error(`Failed to send email to ${user.email} (HTTP ${emailResponse.status}):`, errorText);
          
          // Track failed emails
          stats.emailErrors = stats.emailErrors || [];
          stats.emailErrors.push({
            user: user.id,
            email: user.email,
            statusCode: emailResponse.status,
            error: errorText.substring(0, 200) // Limit error length
          });
        } else {
          const emailResult = await emailResponse.json();
          // Track successful emails
          stats.emailsSent++;
        }
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
        
        // Track email sending errors
        stats.emailErrors = stats.emailErrors || [];
        stats.emailErrors.push({
          user: user.id,
          email: user.email,
          error: error.message
        });
      }
    }

    // Calculate stats from the processed data
    usersWithSearches.forEach(user => {
      if (user.saved_searches) {
        stats.searchesProcessed += user.saved_searches.length;
        
        // Extract unique building addresses
        user.saved_searches.forEach(search => {
          if (search.building_address) {
            stats.buildings.push(search.building_address);
          }
        });
      }
    });
    
    // Count unique buildings
    stats.buildings = [...new Set(stats.buildings)];
    
    // Add execution time to the stats
    stats.executionTimeMs = Date.now() - startTime;
    
    return NextResponse.json({ 
      success: true,
      message: 'Daily listings job completed',
      processedUsers: usersWithSearches.length,
      stats: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Unexpected error in daily listings job:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unknown server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
