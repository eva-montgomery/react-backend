const db = require('./connection');

// all wines
async function allWines() {
    try {
        const wines = await db.any(`select * from wines`);
        return wines;
    } catch (err) {
        return [];
    }
}

// get wines by user ID
async function getWinesByUserID(user_id) {
    try {
        const wines = await db.any(`select * from wines where user_id=$1`, [userId]);
        console.log(wines)
        return wines;
    } catch (err) {
        console.log(err)
        return [];
    }
} 

// add a new wine
async function addWine(wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating, user_id) {
    const result = await db.one(`
    insert into wines
        (wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating, user_id)
    values
        ($1, $2, $3, $4, $5, $6, $7, $8)
    returning id`,
    [wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating, user_id]);

    return result.id;
}

// update wine
async function updateWine(id, wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating) {
    const result = await db.result(`
    update wines set
        wine_name=$2,
        wine_type=$3,
        wine_price=$4,
        wine_store=$5,
        wine_label=$6,
        comments=$7,
        wine_rating=$8
    where id=$1;`,
    [id, wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
}

// update wine name
async function updateWineName (id, wine_name) {
    const result = await db.result(`
        update wines set
            wine_name=$1
        where id=$2;`,
        [wine_name, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};

// update wine type
async function updateWineType (id, type) {
    const result = await db.result(`
        update wines set
            wine_type=$1
        where id=$2;`,
        [wine_type, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};

// update wine price
async function updateWinePrice (id, wine_price) {
    const result = await db.result(`
        update wines set
            wine_price=$1
        where id=$2;`,
        [wine_price, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};
// update wine store
async function updateWineStore (id, wine_store) {
    const result = await db.result(`
        update wines set
            wine_store=$1
        where id=$2;`,
        [wine_store, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};
// update wine label
async function updateWineLabel (id, wine_label) {
    const result = await db.result(`
        update wines set
            wine_label=$1
        where id=$2;`,
        [wine_label, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};

// update wine comments
async function updateWineComments (id, comments) {
    const result = await db.result(`
        update wines set
        comments=$1
        where id=$2;`,
        [comments, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};
// update wine rating 
async function updateWineRating (id, wine_rating) {
    const result = await db.result(`
        update wines set
        wine_rating=$1
        where id=$2;`,
        [wine_rating, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};


// favorite wines

// delete a wine
async function deleteWine(id) {
    const result = await db.result(`delete from wines where id=$1`, [id]);
    console.log(result);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
};



module.exports = {
    allWines,
    getWinesByUserID,
    addWine,
    updateWine,
    updateWineName,
    updateWineType,
    updateWinePrice,
    updateWineStore,
    updateWineLabel,
    updateWineComments,
    updateWineRating,
    deleteWine
   




};