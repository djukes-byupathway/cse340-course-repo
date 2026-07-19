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

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          project_location,
          project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};




export { getAllProjects , getProjectsByOrganizationId }  