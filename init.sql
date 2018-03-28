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
values ('cloud9', 'Reapered');
insert into team (team_name, head_coach)
values ('echo-fox', 'Inero');
insert into team (team_name, head_coach)
values ('team-liquid', 'Locodoco');
insert into team (team_name, head_coach)
values ('100-thieves', 'pro0lly');
insert into team (team_name, head_coach)
values ('clutch-gaming', 'DLim');
insert into team (team_name, head_coach)
values ('team-solomid', 'SSONG');
insert into team (team_name, head_coach)
values ('counter-logic-gaming', 'Zikz');
insert into team (team_name, head_coach)
values ('flyquest', 'Zikz');
insert into team (team_name, head_coach)
values ('golden-guardians', 'dunno');
insert into team (team_name, head_coach)
values ('optic-gaming', 'forgot');

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
values ('1','team-solomid','team-liquid',090517,'B',1680000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('2','echo-fox','100-thieves',110217,'R',1800000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('3','team-liquid','clutch-gaming',100117,'B',17830000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('4','cloud9','echo-fox',120617,'B',3188000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('5','team-solomid','counter-logic-gaming',090517,'B',1380000,8.3);

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

insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('cloud9', 8, 7, 1, 38.9, 105, 72, 1.46);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('100-thieves',	19,	13,	6,	1.24,	192, 155, 300);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('cloud9',	20,	12,	8,	1.07,	223,	209, 300);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('clutch-gaming',	20,	11,	9,	1.14,	171,	150, 200);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('counter-logic-gaming',	18,	7,	11,	0.89,	188,	212, 500);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('echo-fox',	19,	12,	7,	1.15,	243,	212, 123);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('fly-quest',	18,	6,	12,	0.72,	156,	217, 45);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('golden-guardians',	18,	4,	14,	0.71,	156,	219, 984);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('optic-gaming',	18,	5,	13,	0.78,	154,	198, 84);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('team-liquid',	20,	12,	8,	1.14,	190,	166, 0);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('team-solomid',	20,	13,	7,	1.42,	219,	154, 200);

