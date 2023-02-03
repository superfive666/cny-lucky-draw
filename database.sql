create database if not exists `lucky`;
create user `lucky` identified by `<choose-your-password>`;
grant all privileges on *.lucky to `lucky`;

use `lucky`;

drop table if exists `lucky`.`participant`;
create table if not exists `lucky`.`participant` (
  id number primary key auto_increment,
  username varchar(100) not null,
  constraint `uk_user` unique key (`username`)
) engine = InnoDB;
