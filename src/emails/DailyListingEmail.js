import React from 'react';
import { generateListingSlug } from '../lib/slugUtils';

const DailyListingEmail = ({ userName, listings, date }) => {
  const formatPrice = (price) => {
    if (!price) return 'Contact for price';
    return `$${parseInt(price).toLocaleString()}`;
  };

  const formatAddress = (listing) => {
    const { StreetNumber, StreetName, StreetSuffix, UnitNumber, City, StateOrProvince, PostalCode } = listing;
    const address = `${StreetNumber} ${StreetName} ${StreetSuffix || ''} ${UnitNumber || ''}`.trim();
    const cityState = `${City}, ${StateOrProvince} ${PostalCode}`;
    return { address, cityState };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#10B981'; // green
      case 'sold': return '#3B82F6'; // blue
      case 'leased': return '#8B5CF6'; // purple
      default: return '#6B7280'; // gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'New Listing';
      case 'sold': return 'Recently Sold';
      case 'leased': return 'Recently Leased';
      default: return status;
    }
  };

  const groupListingsByBuilding = () => {
    const grouped = {};
    listings.forEach(listing => {
      const buildingSlug = listing.buildingSlug;
      if (!grouped[buildingSlug]) {
        grouped[buildingSlug] = {
          buildingName: listing.buildingName || 'Unknown Building',
          listings: []
        };
      }
      grouped[buildingSlug].listings.push(listing);
    });
    return grouped;
  };

  const groupedListings = groupListingsByBuilding();

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Daily Property Updates</title>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 12px 12px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 12px 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 30px;
              color: #374151;
            }
            .building-section {
              margin-bottom: 40px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .building-header {
              background: #f3f4f6;
              padding: 15px 20px;
              border-bottom: 1px solid #e5e7eb;
            }
            .building-header h3 {
              margin: 0;
              color: #1f2937;
              font-size: 18px;
              font-weight: 600;
            }
            .listing-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
              padding: 20px;
            }
            .listing-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              background: white;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .listing-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }
            .listing-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            .status-badge {
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .listing-title {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 8px;
            }
            .listing-location {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 15px;
            }
            .listing-details {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .detail-item {
              text-align: center;
            }
            .detail-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .detail-value {
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
            }
            .listing-price {
              font-size: 24px;
              font-weight: 700;
              color: #059669;
              text-align: center;
              margin-bottom: 15px;
            }
            .view-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: 600;
              text-align: center;
              width: 100%;
              transition: opacity 0.2s;
            }
            .view-button:hover {
              opacity: 0.9;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .no-listings {
              text-align: center;
              padding: 40px 20px;
              color: #6b7280;
              font-style: italic;
            }
            @media (max-width: 600px) {
              body {
                padding: 10px;
              }
              .content {
                padding: 20px;
              }
              .listing-details {
                grid-template-columns: 1fr;
                gap: 10px;
              }
            }
          `}
        </style>
      </head>
      <body>
        <div className="header">
          <h1>🏠 Daily Property Updates</h1>
          <p>{date}</p>
        </div>
        
        <div className="content">
          <div className="greeting">
            Hi {userName || 'there'}! Here&apos;s your daily update on property activity in your saved buildings.
          </div>

          {Object.keys(groupedListings).length === 0 ? (
            <div className="no-listings">
              <p>No new activity today in your saved buildings.</p>
              <p>Check back tomorrow for updates!</p>
            </div>
          ) : (
            Object.entries(groupedListings).map(([buildingSlug, building]) => (
              <div key={buildingSlug} className="building-section">
                <div className="building-header">
                  <h3>{building.buildingName}</h3>
                </div>
                
                <div className="listing-grid">
                  {building.listings.map((listing, index) => {
                    const { address, cityState } = formatAddress(listing);
                    const status = listing.status || 'new';
                    
                    return (
                      <div key={`${listing.ListingKey || index}`} className="listing-card">
                        <div className="listing-header">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(status), color: 'white' }}
                          >
                            {getStatusText(status)}
                          </span>
                        </div>
                        
                        <div className="listing-title">{address}</div>
                        <div className="listing-location">{cityState}</div>
                        
                        <div className="listing-details">
                          <div className="detail-item">
                            <div className="detail-label">Bedrooms</div>
                            <div className="detail-value">
                              {(listing.BedroomsAboveGrade || 0) + (listing.BedroomsBelowGrade || 0)}
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-label">Bathrooms</div>
                            <div className="detail-value">{listing.BathroomsTotalInteger || 'N/A'}</div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-label">Sq Ft</div>
                            <div className="detail-value">{listing.LivingArea || 'N/A'}</div>
                          </div>
                        </div>
                        
                        <div className="listing-price">
                          {formatPrice(listing.ListPrice || listing.ClosePrice)}
                        </div>
                        
                        {listing.ListingKey && (
                          <a 
                            href={`https://yourdomain.com/condo/${generateListingSlug(listing)}`}
                            className="view-button"
                          >
                            View Details
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          
          <div className="footer">
            <p>You&apos;re receiving this email because you have saved searches for these buildings.</p>
            <p>To manage your preferences, visit your dashboard.</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default DailyListingEmail;
