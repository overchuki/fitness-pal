CREATE TABLE IF NOT EXISTS ICON (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    location VARCHAR(200) NOT NULL UNIQUE,

    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS USER (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(256) UNIQUE,
    description VARCHAR(110),
    password CHAR(60) NOT NULL,
    account_type INT NOT NULL DEFAULT 0,
    icon_fk INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    FOREIGN KEY (icon_fk) REFERENCES ICON(id)
);
CREATE TABLE IF NOT EXISTS ITEM_CATEGORY (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(32) NOT NULL,

    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS ITEM (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    calories INT NOT NULL,
    protein INT NOT NULL,
    carbs INT NOT NULL,
    fat INT NOT NULL,
    cost INT,
    serving_size VARCHAR(50) NOT NULL,
    icon_fk INT NOT NULL DEFAULT 2,
    category_fk INT NOT NULL,
    user_fk INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    FOREIGN KEY (icon_fk) REFERENCES ICON(id),
    FOREIGN KEY (category_fk) REFERENCES ITEM_CATEGORY(id),
    FOREIGN KEY (user_fk) REFERENCES USER(id)
);
CREATE TABLE IF NOT EXISTS MEAL (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    user_fk INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    FOREIGN KEY (user_fk) REFERENCES USER(id)
);
CREATE TABLE IF NOT EXISTS MEAL_ITEM (
    id INT NOT NULL AUTO_INCREMENT,
    item_fk INT NOT NULL,
    meal_fk INT NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (item_fk) REFERENCES ITEM(id),
    FOREIGN KEY (meal_fk) REFERENCES MEAL(id)
);