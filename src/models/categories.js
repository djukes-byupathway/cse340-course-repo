import db from './db.js'

const getAllCategories = async () => {
    const query = `
        select category_id, name from category;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async(id) => {
    const query = `
    select category_id, name from category where category_id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
}

const getCategoriesByProjectId = async (projId) => {
    const query = `
    select p.project_id
        ,  c.category_id
        ,  c.name
    FROM   project as p
		join projectcategory as pc
			on pc.project_id = p.project_id
		join  category as c
			on c.category_id = pc.category_id
        WHERE p.project_id = $1
		;
    `;
    const queryParams = [projId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO projectcategory (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM projectcategory
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

      for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments }  