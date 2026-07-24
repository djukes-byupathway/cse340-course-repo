-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- select * from organization;


-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
	project_id serial primary key,
    organization_id int not null REFERENCES organization(organization_id) ,
	title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    project_location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- insert projects for BrightFuture Builders id = 1
-- select * from organization;
insert into project (organization_id, title, description, project_location, project_date) 
Values --(1, 'Title_1', 'Description_1', 'Location_1', '2026-07-26')
-- , 
(1, 'Title_2', 'Description_2', 'Location_2', '2026-08-08')
, (1, 'Title_3', 'Description_3', 'Location_3', '2026-08-26')
, (1, 'Title_4', 'Description_4', 'Location_4', '2026-09-26')
, (1, 'Title_5', 'Description_5', 'Location_5', '2026-10-26')

-- insert projects for "GreenHarvest Growers" id = 2
insert into project (organization_id, title, description, project_location, project_date) 
Values 
  (2, 'Title_6', 'Description_6', 'Location_6', '2026-07-20')
, (2, 'Title_7', 'Description_7', 'Location_7', '2026-07-26')
, (2, 'Title_8', 'Description_8', 'Location_8', '2026-08-15')
, (2, 'Title_9', 'Description_9', 'Location_9', '2026-09-10')
, (2, 'Title_10', 'Description_10', 'Location_10', '2026-10-15')


-- insert projects for "UnityServe Volunteers" id = 3
insert into project (organization_id, title, description, project_location, project_date) 
Values 
  (3, 'Title_11', 'Description_11', 'Location_11', '2026-07-20')
, (3, 'Title_12', 'Description_12', 'Location_12', '2026-07-26')
, (3, 'Title_13', 'Description_13', 'Location_13', '2026-08-15')
, (3, 'Title_14', 'Description_14', 'Location_14', '2026-09-10')
, (3, 'Title_15', 'Description_15', 'Location_15', '2026-10-15')

/*
select a.project_id, a.organization_id, b.name, a.title, a.description, a.project_location, a.project_date 
from project as a join organization as b on a.organization_id = b.organization_id
order by b.name;


for page retreival we can probably just use this query:
select b.name, a.project_id, a.title, a.project_date
from project as a join organization as b on a.organization_id = b.organization_id
order by a.project_id;

*/


-- ========================================
-- category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);


insert into category (name) 
Values 
  ('Environmental')
, ('Educational')
, ('Community Service')
, ('Health and Wellness')
, ('Disaster Relief')
, ('BSA Eagle Project')
, ('Blood Drive')

select category_id, name from category;

CREATE TABLE projectcategory (
    projectcategory_id SERIAL PRIMARY KEY,
    category_id int not null REFERENCES category(category_id) ,
	project_id int not null REFERENCES project(project_id) 
);

insert into projectcategory (category_id, project_id) 
Values 
  (1, 1)
, (2, 2)
, (3, 3)
, (4, 4)
, (5, 5)
, (1, 6)
, (2, 7)
, (3, 8)
, (3, 9)
, (4, 10)
, (7, 11)
, (5, 12)
, (3, 13)
, (2, 14)
, (5, 15)
;

select b.name
, a.project_id
, a.title
, a.project_date
, c.name
from project as a 
join organization as b on a.organization_id = b.organization_id
join projectcategory as pc on a.project_id = pc.project_id
join category as c on pc.category_id = c.category_id
order by a.project_id;

-- based on feedback from grader, making some data changes; commented out lines are done so that they only run once but there is a record of them being run.
update project set title = 'Schlot''s Creek Clean Up' where project_id = 1;
update project set title = 'Sharing Life Lessons with Trouble Youth' where project_id = 2;
update project set title = 'Town Parade Volunteers' where project_id = 3;
update project set title = 'Smallville Immunization Drive' where project_id = 4;
--insert into projectcategory(project_id, category_id) values(4, 3);
update project set title = 'Tornado Relief Food Drive' where project_id = 5;
update project set title = 'Clean up the Park Day at Woodlawn Park' where project_id = 6;
update project set title = 'Knitting for Fun at the Senior Center' where project_id = 7;
update project set title = 'Deliver Community Events Notices' where project_id = 9;
update project set title = 'Red, White, and Boom! Staffing' where project_id = 8;
update project set title = 'Free Vision Exams' where project_id = 10;
update project set title = 'Johnny''s Eagle Project - Blood Drive' where project_id = 11;
--insert into projectcategory(project_id, category_id) values(11, 6);
--insert into projectcategory(project_id, category_id) values(11, 4);
update project set title = 'Moore Tornado Clean Up', project_location = 'Moore, OK' where project_id = 12;
update project set title = 'Pet Vaccinations' where project_id = 13;
update project set title = 'Smallville Career Fair' where project_id = 14;
update project set title = 'Hoe Down Galla Benefiting Tornado Victims' where project_id = 15;

SELECT
          p.project_id,
          p.title,
          c.category_id,
		  c.name,
          p.description,
          p.project_location,
          p.project_date
        FROM category as c 
		join projectcategory as pc
			on c.category_id = pc.category_id
		join project as p 
			on pc.project_id = p.project_id
        --WHERE c.category_id = 1
        ORDER BY p.project_id;