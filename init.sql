/*Create the team table*/
create table team (
  team_name varchar(30),
  head_coach varchar(30),
  primary key (team_name)
);
/*Create the players table*/
create table players (
  pl_name varchar(30),
  position varchar(10),
  team_name varchar(30) references team,
  rating int,
  primary key (pl_name)
);
/*Create the champion table*/
create table champion (
  ch_name varchar(30) primary key,
  win_rate float,
  pick_rate float,
  ban_rate float
);
/*Create the game table*/
create table game (
  game_id varchar(50),
  team_red varchar(30) references team,
  team_blue varchar(30) references team,
  game_time int not null,
  result char(1),
  duration int,
  patch float,
  primary key (game_id),
  unique (team_red, team_blue, game_time)
);
/*Create the game_stats table*/
create table game_stats (
  game_id varchar(50) references game on delete cascade,
  first_blood varchar(1),
  total_gold_red int,
  total_gold_blue int,
  total_champ_kill int,
  primary key (game_id)
);
/*Create the player_stats table*/
create table player_stats (
  pl_name varchar(30) references players(pl_name) on delete cascade,
  games_played int,
  cs_per_min int,
  assists int,
  kda float,
  minutes_played int,
  cs_total int,
  kills int,
  deaths int,
  kill_participation float,
  primary key (pl_name)
);
/*Create the team_stats table*/
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

/*Create the plays_in table*/
create table plays_in (
  game_id varchar(50),
  ch_name varchar(30),
  pl_name varchar(30),
  primary key (game_id, ch_name, pl_name)
);
/* Insert Statements */

insert into team (team_name, head_coach)
	values ('Cloud9', 'Reapered');
insert into team (team_name, head_coach)
	values ('Echo Fox', 'Inero');
insert into team (team_name, head_coach)
	values ('Team Liquid', 'Locodoco');
insert into team (team_name, head_coach)
	values ('100 Thieves', 'pro0lly');
insert into team (team_name, head_coach)
	values ('Clutch Gaming', 'DLim');
insert into team (team_name, head_coach)
	values ('Team Solo Mid', 'SSONG');
insert into team (team_name, head_coach)
	values ('Counter Logic Gaming', 'Zikz');

insert into players (pl_name, team_name, position)
values ('Doublelift', 'Team Liquid', 'adc');
insert into players (pl_name, team_name, position)
values ('Jensen','Cloud9','mid');
insert into players (pl_name, team_name, position)
values ('Fenix','Echo Fox','mid');
insert into players (pl_name, team_name, position)
values ('Dardoch','Echo Fox','mid');
insert into players (pl_name, team_name, position)
values ('Impact','Team Liquid','top');

insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Gragas',51.4,31.6,12.9);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Varus',46.7,28.8,23.8);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Ashe',49.8,27.5,12.2);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Orianna',52.7,24.8,21.9);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Karma',45.0,23.6,13.1);

insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('1','Team Solo Mid','Team Liquid',090517,'B',1680000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('2','Echo Fox','100 Thieves',110217,'R',1800000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('3','Team Liquid','Clutch Gaming',100117,'B',17830000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('4','Cloud9','Echo Fox',120617,'B',3188000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('5','Team Solo Mid','Counter Logic Gaming',090517,'B',1380000,8.3);

insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('1', 'R', 60000, 70000, 15);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('2', 'R', 45057, 40587, 20);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('3', 'B', 80000, 86789, 23);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('4', 'B', 239485, 200000, 42);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('5', 'R', 100000, 100000, 10);

insert into plays_in (game_id, ch_name, pl_name)
values ('1', 'Gnar', 'Hauntzer');
insert into plays_in (game_id, ch_name, pl_name)
values ('2', 'Anivia', 'Froggen');
insert into plays_in (game_id, ch_name, pl_name)
values ('3', 'Corki', 'Pobelter');
insert into plays_in (game_id, ch_name, pl_name)
values ('4', 'Ryze', 'Jensen');
insert into plays_in (game_id, ch_name, pl_name)
values ('5', 'Azir', 'Bjergsen');

insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Doublelift', 9.1, 27, 7, 37, 81, 10.5, 2783, 266, 8);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Jensen', 9.1, 34, 9, 48, 78.1, 10.5, 3269, 311, 8);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Fenix', 9.1, 39, 10, 52, 71.1, 9.7, 3127, 321, 8);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Dardoch', 8.3, 18, 12, 81, 77.3, 8, 1593, 321, 8);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Impact', 7.6, 24, 8, 37, 74.4, 10.1, 3604, 357, 8);

insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('Cloud9', 8, 7, 1, 38.9, 105, 72, 1.46);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('Echo Fox', 8, 7, 1, 40.2, 128, 79, 1.62);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('Team Liquid', 8, 5, 3, 33.2, 79, 53, 1.49);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('100 Thieves', 8, 4, 4, 43.5, 63, 75, 0.84);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('Clutch Gaming', 8, 4, 4, 38.9, 71, 61, 1.16);
