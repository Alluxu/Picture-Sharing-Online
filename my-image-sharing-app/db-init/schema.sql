-- Create the 'users' table if it does not exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create the 'images' table if it does not exist
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    tags TEXT,
    isPublic BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Create the 'comments' table if it does not exist
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    commentText TEXT NOT NULL,
    imageReference INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (imageReference) REFERENCES images(id)
);