const axios = require('axios');

async function checkAllPins() {
    try {
        const response = await axios.get('http://localhost:8080/api/content/pins/public');
        const pins = response.data;
        console.log(`Fetched ${pins.length} public pins`);

        const ids = pins.map(p => p.id);
        const uniqueIds = new Set(ids);

        if (ids.length !== uniqueIds.size) {
            console.log('Duplicate IDs found in public pins!');
        } else {
            console.log('No duplicate IDs in public pins.');
        }

        // Check for duplicate content (title + description)
        const contentMap = new Map();
        let contentDupes = 0;
        pins.forEach(p => {
            const key = `${p.title}|${p.description}`;
            if (contentMap.has(key)) {
                contentDupes++;
                console.log(`Duplicate content found: ID ${p.id} matches ID ${contentMap.get(key)}`);
            } else {
                contentMap.set(key, p.id);
            }
        });

        if (contentDupes > 0) {
            console.log(`Found ${contentDupes} pins with duplicate content.`);
        } else {
            console.log('No duplicate content found.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkAllPins();
