create table players (
	pl_name vacchar(30),
	position varchar(10),
	team_name varchar(30) references team,
	rating int,
	primary key (pl_name, team_name)
);
create table champion (
	ch_name varchar(30) primary key,
	win_rate double,
	pick_rate double,
	ban_rate double
);
create table game (
	game_id varchar(50),
	team_red varchar(30) references team,
	team_blue varchar(30) references team,
	time long not null,
	result char(1),
	duration long,
	patch double,
	primary key (game_id),
	unique (team_red, team_blue, time)
);
create table game_stats (
	game_id varchar(50) references game,
	first_blood varchar(30) references player,
	total_gold_red int,
	total_gold_blue int,
	total_champ_kill int,
	primary key (game_id),
);
create table plays_in (
	game_id varchar(50) refereces game,
	ch_name varchar(30) references champion,
	pl_name varchar(30) references player,
	primary key (game_id, ch_name, pl_name)
);
create table team (
	team_name varchar(30),
	head_coach varchar(30),
	primary key (name)
);
create table player_stats (
	pl_name varchar(30) references player,
	games_played int,
	cs_per_min int,
	assists int,
	kda double,
	minutes_played int,
	cs_total int,
	kills int,
	deaths int,
	kill_participation double,
	primary key (pl_name),
);
create table team_stats (
	team_name varchar(30) references team,
	games_played int,
	wins int,
	losses int,
	teamkd int,
	total_kills int,
	total_deaths int,
	total_assists int,
	avg_game_time int,
	primary key (team_name)
);
insert into player (pl_name, team_name, position)
	values ('Doublelift', 'TL', 'adc')
insert into player (pl_name, team_name, position)
	values ('Jensen','C9','mid')
insert into player (pl_name, team_name, position)
	values ('Fenix','FOX','mid')
insert into player (pl_name, team_name, position)
	values ('Dardoch','FOX','mid')
insert into player (pl_name, team_name, position)
	values ('Bjersgen','TSM','mid')

insert into champion (ch_name, win_rate, pick_rate, ban_rate)
	values ('Gragas',51.4,31.6,12,9)
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
	values ('Varus',46.7,28.8,23.8)
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
	values ('Ashe',49.8,27.5,12.2)
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
	values ('Orianna',52.7,24.8,21.9)
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
	values ('Karma',45.0,23.6,13.1)

insert into game (game_id,team_red,team_blue,time,result,duration,patch)
	values ('TSM;TL;12:00;02/02/18','TSM','TL',1517601600000,'b',1680000,8.3)
insert into game (game_id,team_red,team_blue,time,result,duration,patch)
	values ('ECHO\ FOX;100\ THIEVES;13:00;02/02/18','ECHO FOX','100 THIEVES',1517605200000,'r',1800000)
insert into game (game_id,team_red,team_blue,time,result,duration,patch)
	values ('TL;CLUTCH\ GAMING;14:00;02/02/18','TL','CLUTCH GAMING',1517608800000,'b',17830000)
insert into game (game_id,team_red,team_blue,time,result,duration,patch)
	values ('C9;ECHO\ FOX;15:00;02/02/18','C9','ECHO FOX',1517612400000,'r',3188000)
insert into game (game_id,team_red,team_blue,time,result,duration,patch)
	values ('TSM;CLG;16:00;02/02/18','TSM','CLG',1517616000000,'b',1380000,8.3)
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
	values ('TSM;TL;12:00;02/02/18'
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
	values ('
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
	value ('
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
	value ('
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
	value ('
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
