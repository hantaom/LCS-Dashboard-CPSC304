create table players (
	pl_name vacchar(30),
	position varchar(10),
	team_name varchar(30) references team,
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
