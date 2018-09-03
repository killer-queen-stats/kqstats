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