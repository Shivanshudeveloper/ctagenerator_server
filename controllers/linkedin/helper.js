const { UnipileClient } = require('unipile-node-sdk');

const { BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE } = require('../../config/config');


const searchLinkedInProfile = async (account_id, identifier) => {
    try {
      // Validate inputs
      if (!account_id || !identifier) {
        throw new Error('Both account_id and identifier are required parameters');
      }
  
      const client = new UnipileClient(BASE_URL_UNIPILE, ACCESS_TOKEN_UNIPILE);
      
      // Add linkedin_sections parameter
      const response = await client.users.getProfile({
        account_id,
        identifier,
        linkedin_sections: '*'  // Request all sections
      });
  
      // Enhanced error logging
      if (!response) {
        throw new Error('No response received from API');
      }
      
      return response;
    } catch (error) {
      console.error('[Search Helper Error]', error);
      
      return {
        success: false,
        errorType: error.response?.status ? 'APIError' : 'ValidationError',
        error: error.message,
        details: error.response?.data || null
      };
    }
};


module.exports = {
    searchLinkedInProfile
}