import db from './db.js'

const getAllProjects = async () => {
    const query = `
        select b.name, a.title, a.project_date
        from project as a join organization as b on a.organization_id = b.organization_id
        order by a.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

export { getAllProjects }  