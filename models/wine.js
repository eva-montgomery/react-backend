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

// get wine by wine ID
async function getWinesByID(id) {
    try {
        const winesById = await db.any(`select * from wines where id=$1`, [id]);
        console.log(winesById)
        return winesById;
    } catch (err) {
        console.log(err)
        return [];
    }
} 


// get wines by user ID
async function getWinesByUserID(user_id) {
    try {
        const wines = await db.any(`select * from wines where user_id=$1`, [user_id]);
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


// update wine without image
async function updateWineWOImage(id, wine_name, wine_type, wine_price, wine_store, comments, wine_rating) {
    const result = await db.result(`
    update wines set
        wine_name=$2,
        wine_type=$3,
        wine_price=$4,
        wine_store=$5,
        comments=$6,
        wine_rating=$7
    where id=$1;`,
    [id, wine_name, wine_type, wine_price, wine_store, comments, wine_rating]);
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
            wine_name=$1,
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


// favorite wines by user ID
async function favoriteWinesByUser(user_id) {
    try {
        const wines = await db.any(`SELECT wines.wine_name, wines.wine_name, wines.wine_price, wines.wine_store, wines.wine_label, wines.comments, wines.wine_rating, favorite_wines.user_id 
        FROM wines 
        INNER JOIN favorite_wines
        ON wines.id = favorite_wines.wine_id
        where favorite_wines.user_id=$1;`, [user_id]);
        console.log(wines)
        return wines;
    } catch (err) {
        console.log(err)
        return [];
    }
}
 
// add favorite wines 
async function addWinesToFavorite(user_id, wine_id) {
    try { 
        const addFavWines = await db.one(`
            insert into favorite_wines 
                (user_id, wine_id)
            values 
                ($1, $2);`, [user_id, wine_id]);
        return addFavWines;    
    } catch (err) {
        console.log(err)
        return [];
    }
}




// favorite wines 
// async function allFavoriteWines() {
//     try {
//         const wines = await db.any(`select * from wines where is_favorite='t'`);
//         console.log(wines)
//         return wines;
//     } catch (err) {
//         console.log(err)
//         return [];
//     }
// }


// delete a wine
//     const result = await db.result(`DELETE from favorite_wines WHERE wine_id = $1;
//     DELETE from wines
//     WHERE id = $1;`, [wine_id]);
//     console.log(result);
//     if (result.rowCount === 1) {
    //         return id;
    //     } else {
        //         return null;
        //     }
        // };
        
async function deleteWine(wine_id) {
const delWine = await db.result(`DELETE from wines WHERE id = $1;`, [wine_id])
if (delWine.rowCount === 1) {
    return id;
} else {
    return null;

}}


// Delete from favorite wines

async function deleteFavWine(wine_id) {
    const delFavWine = await db.result(`DELETE from favorite_wines WHERE wine_id = $1;`, [wine_id])
    if (delFavWine.rowCount === 1) {
        return id;
    } else {
        return null;
    
    }}

// const delFavs = await db.result(`DELETE from favorite_wines WHERE wine_id = $1;`, [wine_id])
// const delWine = await db.result(`
// DELETE from wines
// WHERE id = $1;`, [wine_id]);
// console.log(delFavs);
// if (delFavs.rowCount === 1 && delWine.rowCount === 1) {
//     return id;
// } else {
//     return null;


module.exports = {
    allWines,
    getWinesByID,
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
    deleteWine,
    deleteFavWine,
    favoriteWinesByUser,
    addWinesToFavorite,
    updateWineWOImage
    
};