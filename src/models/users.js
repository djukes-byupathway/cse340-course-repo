import db from './db.js';
import bcrypt from 'bcrypt';


const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
    `;

    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};



const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const results = await findUserByEmail(email);
    if (results === null) {
        return null; // User not found
    }

    const loginSuccess = await verifyPassword(password, results.password_hash);

    if (!loginSuccess) {
        return null; // User not authenticated
    }

    delete results.password_hash;

    return results;
};

const getAllUsers = async () => {
    const query = `
    SELECT u.name, u.user_id, u.email,  r.role_name 
    FROM users u
    LEFT OUTER JOIN roles r ON u.role_id = r.role_id
    `;

    const result = await db.query(query);

    return result.rows;
};

const assignVolunteerToProject = async (userid, projectId) => {
    const query = `
        insert into volunteer (project_id, user_id)  
        VALUES ($2, $1);
    `;

    await db.query(query, [userid, projectId]);
};

const getVolunteerByProject = async (projId) => {
    const query = `
    select v.volunteer_id, v.project_id, p.title, v.user_id, u.name
    from volunteer as v join project as p on v.project_id = p.project_id
	join users as u on v.user_id = u.user_id
    where v.project_id = $1
	;
    `;
    const queryParams = [projId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectsByVolunteer = async (vol_id) => {
    const query = `
    select v.volunteer_id, v.project_id, p.title, v.user_id, u.name
    from volunteer as v join project as p on v.project_id = p.project_id
	join users as u on v.user_id = u.user_id
    where v.user_id = $1;
    `;

    const queryParams = [vol_id];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const removeVolunteerFromProject = async (userid, projectId) => {
    const query = `
        delete from volunteer where user_id = $1 and project_id = $2;
    `;
    const queryParams = [userid, projectId];
    await db.query(query, queryParams);
};


export { createUser, authenticateUser, getAllUsers, getVolunteerByProject, assignVolunteerToProject, getProjectsByVolunteer, removeVolunteerFromProject };