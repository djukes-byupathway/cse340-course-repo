import db from './db.js'

const getAllCategories = async () => {
    const query = `
        select category_id, name from category;
    `;

    const result = await db.query(query);

    return result.rows;
}

export { getAllCategories }  