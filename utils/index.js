function extractJsonObject(text) {
    try {
        // Try to parse the entire text as JSON first
        return JSON.parse(text);
    } catch (firstError) {
        console.log('Failed to parse entire text as JSON:', firstError.message);
        
        try {
            // Try to find and extract the JSON object
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            } else {
                console.log('No JSON-like structure found in text');
                return {};
            }
        } catch (secondError) {
            console.log('Failed to parse extracted JSON:', secondError.message);
            return {};
        }
    }
}


module.exports = {
    extractJsonObject,
}