// Create the reviews table if it doesn't exist
export async function createReviewsTable(db) {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        album TEXT,
        review TEXT,
        rating INTEGER
      );
    `);
    console.log('Reviews table created successfully');
  } catch (error) {
    console.error('Error creating reviews table:', error);
    throw error;
  }
}

// Add a new review to the database
export async function addReview(db, album, review, rating) {
  try {
    const result = await db.runAsync(
      'INSERT INTO reviews (album, review, rating) VALUES (?, ?, ?);',
      [album, review, rating]
    );
    console.log('Review added successfully', result);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

// Fetch all reviews from the database
export async function getReviews(db) {
  try {
    const result = await db.getAllAsync('SELECT * FROM reviews;');
    console.log('Fetched reviews:', result);
    return result;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

// Add Ratings to database
export async function addRating(db, album, rating) {
  try {
    const result = await db.runAsync(
      'INSERT INTO reviews (album, review, rating) VALUES (?, ?, ?);',
      [album, '', rating]
    );
    console.log('Rating added successfully', result);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
}

// Get ratings from the database
export async function getRatings(db) {
  try {
    const result = await db.getAllAsync("SELECT * FROM reviews WHERE review = '' AND rating > 0;");
    console.log('Fetched ratings:', result);
    return result;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
}


