// Create the reviews table if it doesn't exist
export async function createReviewsTable(db) {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        album TEXT,
        cover TEXT,
        review TEXT,
        rating INTEGER,
        userId TEXT
      );
    `);
    console.log('Reviews table created successfully');
  } catch (error) {
    console.error('Error creating reviews table:', error);
    throw error;
  }
}

// Add a new review to the database
export async function addReview(db, album, cover, review, rating, userId) {
  try {
    const result = await db.runAsync(
      'INSERT INTO reviews (album, cover, review, rating, userId) VALUES (?, ?, ?, ?, ?);',
      [album, cover, review, rating, userId]
    );
    console.log('Review added successfully', result);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

// Fetch all reviews from the database only for the given userId 
export async function getReviews(db, userId) {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM reviews WHERE review <> "" AND userId = ?;',
      [userId]
    );
    console.log('Fetched reviews:', result);
    return result;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

// Add a rating to the database 
export async function addRating(db, album, cover, rating, userId) {
  try {
    const result = await db.runAsync(
      'INSERT INTO reviews (album, cover, review, rating, userId) VALUES (?, ?, ?, ?, ?);',
      [album, cover, '', rating, userId]
    );
    console.log('Rating added successfully', result);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
}

// Get ratings from the database only for the given userId
export async function getRatings(db, userId) {
  try {
    const result = await db.getAllAsync(
      "SELECT * FROM reviews WHERE review = '' AND rating > 0 AND userId = ?;",
      [userId]
    );
    console.log('Fetched ratings:', result);
    return result;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
}



