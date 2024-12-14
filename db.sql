-- tables
drop table if exists customer cascade;
drop table if exists category cascade;
drop table if exists rental cascade;
drop table if exists equipment cascade;

-- create tables
create table customer (
    id char(5) not null primary key,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(255) not null,
    phone varchar(20) not null,
    status char(2) not null default '0',
    avatar varchar(255),
    note varchar(255)
);
comment on table customer is 'Customer table';
comment on column customer.id is 'Primary key';
comment on column customer.first_name is 'First name';
comment on column customer.last_name is 'Last name';
comment on column customer.email is 'Email';
comment on column customer.phone is 'Phone';
comment on column customer.status is 'Status (0: inactive, 1: active, 2: 10% discount)';
comment on column customer.avatar is 'Avatar';
comment on column customer.note is 'Note';

create table category(
    number char(2) not null primary key,
    description varchar(100) not null
);
comment on table category is 'Category table';
comment on column category.number is 'Primary key';
comment on column category.description is 'Category description';

create table equipment(
    id char(5) not null primary key,
    category_number char(2) not null,
    name varchar(100) not null default 'unknown',
    description varchar(255),
    daily_cost decimal(10, 2) not null,
    status char(2) not null default '0',
    rental_id char(5),
    rental_date date,
    return_date date,
    rental_cost decimal(10, 2) not null default 0
);
comment on table equipment is 'Equipment table';
comment on column equipment.id is 'Primary key';
comment on column equipment.category_number is 'foreign key category number reference category table';
comment on column equipment.name is 'Equipment name';
comment on column equipment.description is 'Equipment description';
comment on column equipment.daily_cost is 'rental daily cost';
comment on column equipment.status is 'Status (0: available, 1: rented)';
comment on column equipment.rental_id is 'foreign key rental id reference rental table';
comment on column equipment.rental_date is 'rental start date';
comment on column equipment.return_date is 'rental return date';
comment on column equipment.rental_cost is 'rental cost';

create table rental(
    id char(5) not null primary key,
    create_date date not null default current_date,
    customer_id char(5) not null,
    customer_last_name varchar(100) not null default 'unknown',
    total decimal(10, 2) not null
);
comment on table rental is 'Rental table';
comment on column rental.id is 'Primary key';
comment on column rental.create_date is 'rental created date';
comment on column rental.customer_id is 'foerign key customer id reference customer table';
comment on column rental.customer_last_name is 'customer last name';
comment on column rental.total is 'total rental cost of the same serial number';


-- insert into category
insert into category (number, description) values 
('10', 'Power Tools'),
('20', 'Yard Equipment'),
('30', 'Compressors'),
('40', 'Generators'),
('50', 'Air Tools')
;

-- insert into customer
insert into customer (id, first_name, last_name, email, phone, status, avatar, note) values
('1001','John','Doe','jd@sample.net','(555)555-1212','0','https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_4.png',''),
('1002','Jane','Smith','js@live.com','(555)555-3434','1','',''),
('1003','Michael','Lee','ml@sample.net','(555)555-5656','2','https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_2.png','')
;

-- insert into rental
insert into rental (id, create_date, customer_id, customer_last_name, total) values
('1000','2024-02-15','1001','Doe', 149.97),
('1001','2024-02-16','1002','Smith', 43.96)
;

-- insert into equipment
insert into equipment (id, category_number, name, description, daily_cost, status, rental_id, rental_date, return_date, rental_cost) values
('101','10','Hammer drill','Powerful drill for concrete and masonry', 25.99, '0', null, null, null, 0.00),
('201','20','Chainsaw','Gas-powered chainsaw for cutting wood', 49.99, '1', '1000', '2024-02-20', '2024-02-23', 149.97),
('202','20','Lawn mower','Self-propelled lawn mower with mulching function', 19.99, '0', null, null, null, 0.00),
('301','30','Small Compressor','5 Gallon Compressor-Portable', 14.99, '0', null, null, null, 0.00),
('501','50','Brad Nailer','Brad Nailer. Requires 3/4 to 1 1/2 Brad Nails', 10.99, '0', '1001', '2024-02-21', '2024-02-25', 43.96)
;