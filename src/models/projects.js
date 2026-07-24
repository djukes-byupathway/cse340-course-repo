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

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
          p.project_id,
          c.category_id,
          p.title,
          p.description,
          p.project_location,
          p.project_date,
          o.name as organization_name
        FROM category as c
		join projectcategory as pc
			on c.category_id = pc.category_id
		join project as p
			on pc.project_id = p.project_id
        join organization as o
            on p.organization_id = o.organization_id
        WHERE c.category_id = $1
        ORDER BY p.project_date;
      `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};




const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        select
            a.project_id,
            a.title,
            a.description,
            a.project_date,
            a.project_location,
            b.organization_id,
            b.name as organization_name
        from project as a
        join organization as b
            on a.organization_id = b.organization_id
        where a.project_date >= CURRENT_DATE
        order by a.project_date asc
        limit $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;

}

const getProjectDetails = async (id) => {
    const query = `
        select
            a.project_id as project_id,
            a.title as title,
            a.description as description,
            a.project_date as project_date,
            a.project_location as project_location,
            b.organization_id as organization_id,
            b.name as organization_name 
        from project as a
        join organization as b
            on a.organization_id = b.organization_id
        where a.project_id =$1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
}

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId }  