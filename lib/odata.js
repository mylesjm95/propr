"use strict";

/**
 * A utility class for building OData queries for the TREB API
 */
class ODataQuery {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.filters = [];
    this.selects = [];
    this.orderby = null;
    this.top = null;
    this.skip = null;
    this.count = false;
  }

  /**
   * Add a filter condition
   * @param {string} filter - OData filter expression
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  filter(filter) {
    this.filters.push(filter);
    return this;
  }

  /**
   * Add a field to select
   * @param {string|string[]} fields - Field(s) to select
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  select(fields) {
    if (Array.isArray(fields)) {
      this.selects = [...this.selects, ...fields];
    } else {
      this.selects.push(fields);
    }
    return this;
  }

  /**
   * Set the orderby clause
   * @param {string} field - Field to order by
   * @param {boolean} [desc=false] - Whether to order in descending order
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  orderBy(field, desc = false) {
    this.orderby = `${field}${desc ? ' desc' : ' asc'}`;
    return this;
  }

  /**
   * Set the top clause (limit)
   * @param {number} limit - Maximum number of results to return
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  limit(limit) {
    this.top = limit;
    return this;
  }

  /**
   * Set the skip clause (offset)
   * @param {number} offset - Number of results to skip
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  offset(offset) {
    this.skip = offset;
    return this;
  }
  
  /**
   * Enable or disable the count parameter
   * @param {boolean} [enable=true] - Whether to include the count in the response
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  withCount(enable = true) {
    this.count = enable;
    return this;
  }

  /**
   * Add a date range filter
   * @param {string} field - Date field to filter on
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  dateRange(field, startDate, endDate) {
    const startDateStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
    const endDateStr = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
    
    this.filter(`${field} ge ${startDateStr} and ${field} le ${endDateStr}`);
    return this;
  }

  /**
   * Add a contains filter
   * @param {string} field - Field to check
   * @param {string} value - Value to check for
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  contains(field, value) {
    this.filter(`contains(${field}, '${value}') eq true`);
    return this;
  }

  /**
   * Add an equals filter
   * @param {string} field - Field to check
   * @param {string|number} value - Value to check for
   * @returns {ODataQuery} - Returns this instance for chaining
   */
  equals(field, value) {
    const formattedValue = typeof value === 'string' ? `'${value}'` : value;
    this.filter(`${field} eq ${formattedValue}`);
    return this;
  }

  /**
   * Get the full query URL
   * @returns {string} - The full OData query URL
   */
  buildUrl() {
    const params = [];

    // Add filter
    if (this.filters.length > 0) {
      params.push(`$filter=${encodeURIComponent(this.filters.join(' and '))}`);
    }

    // Add select
    if (this.selects.length > 0) {
      params.push(`$select=${encodeURIComponent(this.selects.join(','))}`);
    }

    // Add orderby
    if (this.orderby) {
      params.push(`$orderby=${encodeURIComponent(this.orderby)}`);
    }

    // Add top
    if (this.top !== null) {
      params.push(`$top=${this.top}`);
    }

    // Add skip
    if (this.skip !== null) {
      params.push(`$skip=${this.skip}`);
    }
    
    // Add count if enabled
    if (this.count) {
      params.push('$count=true');
    }

    // Construct the URL
    return `${this.baseUrl}?${params.join('&')}`;
  }

  /**
   * Execute the query using fetch
   * @param {Object} options - Fetch options
   * @param {Object} [options.headers={}] - Headers to include in the request
   * @param {string} [options.cache='no-store'] - Cache mode to use
   * @param {string} [options.overrideUrl] - Optional URL to override the built URL
   * @param {number} [options.retries=3] - Number of retry attempts
   * @param {number} [options.initialDelay=500] - Initial delay in ms before retrying (will increase with backoff)
   * @param {number} [options.maxDelay=5000] - Maximum delay in ms
   * @returns {Promise<Object>} - The parsed JSON response
   */
  async execute(options = {}) {
    const { 
      headers = {}, 
      cache = 'no-store', 
      overrideUrl,
      retries = 3,
      initialDelay = 500,
      maxDelay = 5000
    } = options;
    const url = overrideUrl || this.buildUrl();
    
    let attempt = 0;
    let delay = initialDelay;
    
    while (attempt <= retries) {
      try {
        const response = await fetch(url, {
          headers,
          cache
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OData API error: ${response.status} - ${errorText}`);
        }

        return response.json();
      } catch (error) {
        attempt++;
        
        // If we've used all our retries, or if it's not a network error, throw the error
        const isNetworkError = error.message.includes('fetch failed') || 
                              error.message.includes('network') ||
                              error.message.includes('ECONNREFUSED') ||
                              error.message.includes('ETIMEDOUT') ||
                              error.message.includes('ENOTFOUND') ||
                              error instanceof TypeError;
                              
        if (attempt > retries || !isNetworkError) {
          console.error(`OData fetch failed after ${attempt} attempts:`, error.message);
          throw error;
        }
        
        // Calculate exponential backoff with jitter
        const jitter = Math.random() * 0.3 + 0.85; // Random between 0.85 and 1.15
        delay = Math.min(delay * 2 * jitter, maxDelay);
        
        console.warn(`OData fetch attempt ${attempt}/${retries} failed. Retrying in ${Math.round(delay)}ms...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

/**
 * Create a TREB Property query builder
 * @param {string} [token] - Optional TREB API token. If not provided, it will be read from env vars
 * @returns {ODataQuery} - An OData query builder for the TREB Property endpoint
 */
export function createPropertyQuery(token = null) {
  const apiToken = token || process.env.TREB_TOKEN;
  const baseUrl = 'https://query.ampre.ca/odata/Property';
  const query = new ODataQuery(baseUrl);

  // Create a new object that preserves prototype chain
  const enhancedQuery = Object.create(
    Object.getPrototypeOf(query),
    Object.getOwnPropertyDescriptors(query)
  );
  
  // Override execute method
  enhancedQuery.execute = async function(options = {}) {
    if (!apiToken) {
      throw new Error('TREB_TOKEN is required. Please provide a token or set it in your environment variables.');
    }
    
    // Add the authorization headers
    const headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };
    
    return ODataQuery.prototype.execute.call(this, { ...options, headers });
  };
  
  return enhancedQuery;
}

/**
 * Create a TREB Media query builder
 * @param {string} [token] - Optional TREB API token. If not provided, it will be read from env vars
 * @returns {ODataQuery} - An OData query builder for the TREB Media endpoint
 */
export function createMediaQuery(token = null) {
  const apiToken = token || process.env.TREB_TOKEN;
  const baseUrl = 'https://query.ampre.ca/odata/Media';
  const query = new ODataQuery(baseUrl);

  // Create a new object that preserves prototype chain
  const enhancedQuery = Object.create(
    Object.getPrototypeOf(query),
    Object.getOwnPropertyDescriptors(query)
  );
  
  // Override execute method
  enhancedQuery.execute = async function(options = {}) {
    if (!apiToken) {
      throw new Error('TREB_TOKEN is required. Please provide a token or set it in your environment variables.');
    }
    
    // Add the authorization headers
    const headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };
    
    return ODataQuery.prototype.execute.call(this, { ...options, headers });
  };
  
  return enhancedQuery;
}

/**
 * Create a TREB PropertySold query builder
 * @param {string} [token] - Optional TREB API token. If not provided, it will be read from env vars
 * @returns {ODataQuery} - An OData query builder for the TREB PropertySold endpoint
 */
export function createPropertySoldQuery(token = null) {
  const apiToken = token || process.env.TREB_TOKEN;
  const baseUrl = 'https://query.ampre.ca/odata/PropertySold';
  const query = new ODataQuery(baseUrl);
  
  // Create a new object that preserves prototype chain
  const enhancedQuery = Object.create(
    Object.getPrototypeOf(query),
    Object.getOwnPropertyDescriptors(query)
  );
  
  // Override execute method
  enhancedQuery.execute = async function(options = {}) {
    if (!apiToken) {
      throw new Error('TREB_TOKEN is required. Please provide a token or set it in your environment variables.');
    }
    
    // Add the authorization headers
    const headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };
    
    return ODataQuery.prototype.execute.call(this, { ...options, headers });
  };
  
  return enhancedQuery;
}
