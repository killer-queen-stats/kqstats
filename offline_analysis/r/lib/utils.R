require(png)
require(graphics)

path_to_repo <- if("path_to_repo" %in% ls()) path_to_repo else "~/"

#Known gates
gates <- read.table(text="
day warrior left 560 260
day warrior center 960 500
day warrior right 1360 260
day speed left 410 860
day speed right 1510 860
night warrior left 700 260
night warrior center 960 700
night warrior right 1220 260
night speed left 170 740
night speed left 1750 740
dusk warrior left 310 620
dusk warrior center 960 140
dusk warrior right 1610 620
dusk speed left 340 140
dusk speed right 1580 140")
names(gates) <- c("map", "type", "area", "x_pos", "y_pos")
gates$pos_unified <- paste(gates$x_pos, gates$y_pos, sep=",")

#Extraction logic
extraction_regex <- "\\[k\\[(.*?)\\],v\\[(.*?)\\]\\]"

#Events to add
#[1] "alive"           "berryDeposit"    "berryKickIn"     "blessMaiden"     "carryFood"       "gameend"   
#[7] "gamestart"       "getOffSnail: "   "getOnSnail: "    "glance"          "playerKill"      "playernames"    
#[13] "reserveMaiden"   "snailEat"        "snailEscape"     "spawn"           "unreserveMaiden" "useMaiden"      
#[19] "victory"  

event_fields_list <- list(
       berryDeposit = c("x_pos", "y_pos", "player")
     , berryKickIn = c("x_pos", "y_pos", "player")
     , blessMaiden = c("x_pos", "y_pos", "team")
     , carryFood = c("player")
     , useMaiden = c("x_pos", "y_pos", "type", "player")
     , playerKill = c("x_pos", "y_pos", "killer", "victim", "victim_type")
     , reserveMaiden = c("x_pos", "y_pos", "player")
     , victory = c("win_team", "win_condition")
     , gameend = c("map", "X2", "duration", "X4")
)

character_pos = c(
  GoldQueen = 1,
  BlueQueen = 2,
  GoldStripes = 3,
  BlueStripes = 4,
  GoldAbs = 5,
  BlueAbs = 6,
  GoldSkulls = 7,
  BlueSkulls = 8,
  GoldChecks = 9,
  BlueChecks = 10
)
gold_team <- c(1,3,5,7,9)
blue_team <- c(2,4,6,8,10)

color_gold = "#e88f12"
color_blue = "#c9d6ff"
kq_colors = c(Gold = color_gold, Blue = color_blue)

#Hive locations
#reference https://docs.google.com/spreadsheets/d/1o0S1GQBXvKqM18AKo_UQD5UEOqVIca2Ilti24PikPIo/edit?usp=sharing
hives <- structure(list(map = c("map_dusk", "map_dusk", "map_dusk", "map_dusk", 
"map_dusk", "map_dusk", "map_dusk", "map_dusk", "map_day", "map_day", 
"map_day", "map_day", "map_day", "map_day", "map_day", "map_day", 
"map_night", "map_night", "map_night", "map_night", "map_night", 
"map_night", "map_night", "map_night"), team = c("left", "left", 
"left", "left", "right", "right", "right", "right", "left", "left", 
"left", "left", "right", "right", "right", "right", "left", "left", 
"left", "left", "right", "right", "right", "right"), axis = c("x", 
"x", "y", "y", "x", "x", "y", "y", "x", "x", "y", "y", "x", "x", 
"y", "y", "x", "x", "y", "y", "x", "x", "y", "y"), bound = c("lower", 
"upper", "lower", "upper", "lower", "upper", "lower", "upper", 
"lower", "upper", "lower", "upper", "lower", "upper", "lower", 
"upper", "lower", "upper", "lower", "upper", "lower", "upper", 
"lower", "upper"), value = c(710L, 950L, 490L, 765L, 1050L, 1280L, 
490L, 765L, 740L, 980L, 780L, 1000L, 1020L, 1270L, 780L, 1000L, 
0L, 470L, 0L, 230L, 1550L, 2000L, 0L, 230L)), row.names = c(NA, 
-24L), class = "data.frame")

#Image data
img_day <- "https://raw.githubusercontent.com/arantius/kqdeathmap/master/img/map_day.png"
img_night <- "https://raw.githubusercontent.com/arantius/kqdeathmap/master/img/map_night.png"
img_dusk <- "https://raw.githubusercontent.com/arantius/kqdeathmap/master/img/map_dusk.png"


#read map data
night_png <- readPNG(paste0(path_to_repo, 'repos/kqstats/offline_analysis/r/maps/map_night.png'))
day_png <- readPNG(paste0(path_to_repo, 'repos/kqstats/offline_analysis/r/maps/map_day.png'))
dusk_png <- readPNG(paste0(path_to_repo, 'repos/kqstats/offline_analysis/r/maps/map_dusk.png'))
