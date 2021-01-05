drop table if exists businesses;

create table businesses (
       id varchar(9) primary key,
       url varchar(50),
       name varchar(500),
       address varchar(500),
       locality varchar(50),
       region varchar(50),
       zip varchar(10),
       phone varchar(50),
       lat real,
       lon real,
       categories varchar(1000)
       )
