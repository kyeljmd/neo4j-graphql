CREATE TABLE team (
  id SERIAL PRIMARY KEY,
  name VARCHAR (255)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  class VARCHAR(20),
  employee_code VARCHAR(20)
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES team(id),
  member_id INT NOT NULL references employee(id)
);

CREATE TABLE direct_reports (
  id SERIAL PRIMARY KEY,
  supervisor_id INT NOT NULL REFERENCES employee(id),
  employee_id INT NOT NULL REFERENCES employee(id)
);

INSERT INTO team(id, name) 
VALUES (1, 'designers'), (2, 'management');

INSERT INTO employee (ID, NAME, CLASS, employee_code)
 VALUES 
    (1 , 'ULYSSES TY', 'VP', 'P0001'),
    (2 , 'Niko Erwin Edralin', 'Lead Desginer', 'p002'),
    (3 , 'Kenneth Estanislao', 'Designer', 'P003'),
    (4 , 'Noah Tumlos', 'Designer', 'p005'),
    (5 , 'Edwin Quita', 'Designer', 'p006'),
    (6 , 'Kyel John David', 'Designer', 'p007');

INSERT INTO direct_reports(supervisor_id, employee_id)
    VALUES (1,2), (2,3), (2,4), (2,5), (2,6);

INSERT INTO members(team_id, member_id)
VALUES (1,2),(1,3),(1,4),(1,5),(1,6),(2,1),(2,2);