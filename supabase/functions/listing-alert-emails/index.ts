// supabase/functions/daily-listings-email/index.ts
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
console.log("Daily Listings Email Edge Function initialized!");
serve(async (req)=>{
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405
    });
  }
  try {
    // Initialize Supabase client
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    // Fetch users with saved searches
    const { data: users, error: usersError } = await supabase.from("users").select("id, email, saved_searches").not("saved_searches", "is", null);
    if (usersError || !users) {
      console.error("Error fetching users:", usersError?.message);
      return new Response("Failed to fetch users", {
        status: 500
      });
    }
    // Calculate timestamp for listings from the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const trebToken = Deno.env.get("TREB_TOKEN");
    if (!trebToken) throw new Error("TREB_TOKEN is not defined");
    // Process each user
    for (const user of users){
      const searches = user.saved_searches || [];
      if (!searches.length) continue;
      let allListings = [];
      // Query TREB API for each saved search
      for (const search of searches){
        const buildingAddress = search.building_address; // e.g., "123 Main St" or "456 Bayview Park Dr"
        console.log(`Processing ${buildingAddress} for ${user.email}`);
        // Parse street number and name
        const [streetNumber, ...streetNameParts] = buildingAddress.split(" ");
        const streetName = streetNameParts.join(" ").trim(); // Handles "Main St" or "Bayview Park Dr"
        if (!streetNumber || !streetName) {
          console.error(`Invalid address format: ${buildingAddress}`);
          continue;
        }
        // Build OData filter
        const filter = `StreetNumber eq '${streetNumber}' and contains(StreetName, '${streetName}') and (MlsStatus eq 'New' or MlsStatus eq 'Sld' or MlsStatus eq 'Lsd') and ModificationTimestamp ge ${yesterday}`;
        const url = `https://query.ampre.ca/odata/Property?$filter=${encodeURIComponent(filter)}&$select=UnparsedAddress,ListPrice,MlsStatus,BedroomsTotal,BathroomsTotalInteger,LivingAreaRange,ParkingTotal&$top=10&$orderby=ListPrice%20desc`;
        try {
          const trebResponse = await fetch(url, {
            headers: {
              Authorization: `Bearer ${trebToken}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          });
          if (!trebResponse.ok) {
            console.error(`TREB API error for ${buildingAddress}: ${trebResponse.statusText}`);
            continue;
          }
          const data = await trebResponse.json();
          const listings = data.value || [];
          console.log(`Found ${listings.length} listings for ${buildingAddress}`);
          allListings = allListings.concat(listings);
        } catch (err) {
          console.error(`Error querying TREB for ${buildingAddress}: ${err.message}`);
        }
      }
      if (!allListings.length) {
        console.log(`No new listings for ${user.email}`);
        continue;
      }
      // Format email content
      const listingsHtml = allListings.map((listing)=>`
          <li>
            <strong>${listing.UnparsedAddress}</strong> - ${listing.MlsStatus} ($${listing.ListPrice.toLocaleString()})
            <br>Beds: ${listing.BedroomsTotal} | Baths: ${listing.BathroomsTotalInteger} | Area: ${listing.LivingAreaRange || "N/A"} | Parking: ${listing.ParkingTotal || "N/A"}
          </li>
        `).join("");
      const emailBody = `
        <h2>Your Daily Condo Listings Update</h2>
        <p>New listings for your saved condo buildings:</p>
        <ul>${listingsHtml}</ul>
        <p><a href="https://skyscrapr.com/settings">Manage your subscriptions</a></p>
      `;
      // Send email via Resend
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "listings@proprmarketing.co",
          to: user.email,
          subject: "Your Daily Condo Listings Update",
          html: emailBody
        })
      });
      if (!emailResponse.ok) {
        console.error(`Failed to send email to ${user.email}: ${emailResponse.statusText}`);
      } else {
        console.log(`Email sent to ${user.email} with ${allListings.length} listings`);
      }
    }
    return new Response("Emails processed", {
      status: 200
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response("Internal Server Error", {
      status: 500
    });
  }
});
