#Libraries
require(stringr)
require(ggplot2)
require(lubridate)
require(dplyr)
require(tidyr)

#Load utilities
path_to_repo <- if("path_to_repo" %in% ls()) path_to_repo else "~/"
source(paste0(path_to_repo, 'repos/kqstats/offline_analysis/r/lib/utils.R'))

#Working functions
read_data <- function(file) {
  r <- read.table(file, sep="!", skipNul=TRUE, skip=1)
  
  event_data <- .event_log(r)
  
  ts_log <- as.numeric(gsub(".*?([0-9]+).*", "\\1", r[,1]))
  raw_time <- as.POSIXct(ts_log/1000, origin = "1970-01-01")
  
  ans <- data.frame(event_data, ts=raw_time, stringsAsFactors=FALSE)
  return(ans)
}

.extract <- function(x, pos) {
  pos <- paste0("\\", pos)
  sub(extraction_regex, pos, x)
}

.event_log <- function(log) {
  log <- log[,2]
  game_id <- cumsum(1:length(log) %in% (which(grepl("victory", log)) + 1L)) + 1L

  event_name = .extract(log, 1)
  event_values = .extract(log, 2)
  
  return(data.frame(log_id=1:length(log), game_id, event_name, event_values))
}

split_to_df <- function(event_log, event_name) {
  if(!event_name %in% unique(event_log$event_name)) stop("event not in log")
  e <- event_log[event_log$event_name == event_name,]
  s <- str_split(e[,"event_values"], ",")
  d <- if(all(lengths(s) == 1)) {
         data.frame(unlist(s), stringsAsFactors=FALSE)
       } else {
         data.frame(t(sapply(s, c)), stringsAsFactors=FALSE)
       }
  if(event_name %in% names(event_fields_list)) {
  names(d) <- event_fields_list[[event_name]]
  }
  ans_df <- numerify_at(cbind.data.frame(e, d))
  

  return(ans_df)
}

  # if(refine) {
  #   ref <- ans_df %>%
  #     mutate(runner_team = playerTeam(player),
  #            map = mapLocate(game_id),
  #            hivePlaced = hive(x_pos, y_pos, map))
  # }

mapLocate <- function(events, ids) {
  games <- game_log(events)
  quick_map(games$game_id, ids, games$map)
}

playerTeam <- function(player_id) {
  ifelse(player_id %in% gold_team, "Gold", "Blue")
}

hivePlaced <- function(x, y, map_name) {
  if(inBlueHive(x,y,map_name)) "Blue"
  if(inGoldHive(x,y,map_name)) "Gold"
  
}

#mapply(inHive, bk$x_pos, bk$y_pos, bk$map, "right")
inHive <- function(x,y,map_name, team_side) {
 stopifnot(map_name %in% unique(hives$map))
  pos <- hives[hives$map == map_name & hives$team == team_side,]
  
  x >= pos$value[pos$axis== "x" & pos$bound == "lower"] & 
  x <= pos$value[pos$axis== "x" & pos$bound == "upper"] &
  y >= pos$value[pos$axis== "y" & pos$bound == "lower"] &
  y <= pos$value[pos$axis== "y" & pos$bound == "upper"]
}



numerify_at <- function(.df) {
  force_num <- suppressWarnings(lapply(.df, function(x) as.numeric(as.character(x))))
  is_num <- sapply(force_num, function(x) all(!is.na(x)))
  if(all(is_num)) return(.df)
  .df[is_num] <- lapply(.df[is_num], as.numeric)
  
  return(.df)
}

game_log <- function(event_log) {
  ge <- split_to_df(event_log, "gameend")
  gv <- split_to_df(event_log, "victory")
  ge_gv <- inner_join(ge, gv, by="game_id")
  g <- ge_gv[,c("game_id", "map", "duration", "win_team", "win_condition")]
  g["duration"] <- as.numeric(as.character(g[,"duration"]))
  
  kills <- split_to_df(event_log, "playerKill")
  qkills <- kills %>% 
    filter(victim_type == "Queen") %>% 
    group_by(game_id, victim) %>% 
    tally() %>%
    mutate(victim = ifelse(victim == 1, "Gold", "Blue")) %>%
    spread(victim, n) %>% ungroup() %>%
    mutate(Blue = ifelse(is.na(Blue), 0, Blue),
           Gold = ifelse(is.na(Gold), 0, Gold)) %>%
    select(game_id, BlueQ_deaths=Blue, GoldQ_deaths=Gold)
  
  return(left_join(g, qkills, by="game_id"))
}

quick_map <- function(source_key, dest_key, source_col) {
  source_col[match(dest_key, source_key)]
}

bonus_game_pos_check <- function(event_log) {
  bless_maiden_events <- split_to_df(event_log, "blessMaiden")
  bless_maiden_events$pos_unified <- paste(bless_maiden_events[,"x_pos"], 
                                           bless_maiden_events[,"y_pos"], sep=",")
  bless_maiden_include <- bless_maiden_events$pos_unified %in% gates$pos_unified
  
  reserve_maiden_events <- split_to_df(event_log, "reserveMaiden")
  reserve_maiden_events$pos_unified <- paste(reserve_maiden_events[,"x_pos"], 
                                             reserve_maiden_events[,"y_pos"], sep=",")
  reserve_maiden_include <- reserve_maiden_events$pos_unified %in% gates$pos_unified
  bonus_games <- unique(c(bless_maiden_events[!bless_maiden_include,"game_id"],
           reserve_maiden_events[!reserve_maiden_include,"game_id"])
  )
  
  return(bonus_games)
}

bonus_game_kill_check <- function(event_log) {
  g <- game_log(event_log)
  gdf <- g %>% filter(win_condition == "military",
               pmax(BlueQ_deaths, GoldQ_deaths) == 2)
  remove_games <- unlist(gdf$game_id)
  return(remove_games)
  }

bonus_games <- function(event_log) sort(unique(c(bonus_game_pos_check(event_log), 
                                                 bonus_game_kill_check(event_log))))

event_exports <- function(event_log, event_fields_list) {
  event_exports <- list()
  
  for(i in 1:length(event_fields_list)) {
    export_df <- split_to_df(event_log, names(event_fields_list)[i])
    export_df <- export_df[,names(export_df) != "event_values"]
    event_exports[[i]] <- export_df
  }
  
  return(event_exports)
}

gate_control <- function(log) {
  gates <- split_to_df(log, "blessMaiden")
  gates$team <- ifelse(gates$team == "Red", "Gold", "Blue")

  gameend_ts <- split_to_df(events, "gameend")[,c("game_id", "ts")]
  names(gameend_ts) <- c("game_id", "gameend_ts")
  gates_ts <- gates %>% 
            mutate(gate_id = paste(x_pos, y_pos, sep=",")) %>%
            group_by(gate_id, game_id) %>%
            mutate(tag_id = 1:n(),
                   ts_prev_tag = lag(ts),
                   duration = as.duration(ts_prev_tag %--% ts)) %>%
            left_join(gameend_ts, by="game_id") %>%
            mutate(duration_tag_to_gameend = as.duration(ts %--% gameend_ts)
                   ,time_gate_held = ifelse(tag_id == max(tag_id), duration_tag_to_gameend, lead(duration))
            )

  g <- gates_ts %>% 
    group_by(game_id) %>%
    summarise(gold_time = sum(ifelse(team == "Gold", time_gate_held, 0), na.rm=TRUE),
            blue_time = sum(ifelse(team == "Blue", time_gate_held, 0), na.rm=TRUE),
            gold_gate_control=gold_time / (gold_time + blue_time),
            blue_gate_control=1-gold_gate_control)
  gg <- as.data.frame(g)

  return(gg)
}

#Matching sream to game ts
time_adjust <- function(field, stream_ts, event_ts) {
  stream_ts <- ymd_hms(stream_ts)  
  event_ts <- ymd_hms(event_ts)
  ts_dif <- as.duration(stream_ts %--% event_ts)
  
  return(strftime(field - ts_dif, "%T"))
}

#Berry runs
berryDeposits <- function(events) {
  games <- game_log(events)
  
  k <- split_to_df(events, "berryKickIn")

  b <- split_to_df(events, "berryDeposit") %>%
  group_by(game_id) %>%
  summarise(gold_berries = sum(ifelse(player %in% gold_team, 1, 0)),
            blue_berries = sum(ifelse(player %in% blue_team, 1, 0)))
  
  gb <- left_join(games, b, by="game_id")
  gb %>% select(game_id, gold_berries, blue_berries)
}

quick_viz <- function(df_source, map="map_day", point.size=3,override.color=NA, ...) {
  map <- if("map" %in% names(df_source)) unlist(df_source[1, "map"]) else map
  map <- if(gsub(".*?(dusk).*", "\\1", map) %in% c("dusk")) {
           dusk_png
  } else if(gsub(".*?(night).*", "\\1", map) %in% c("night")) {
           night_png
  } else {
           day_png
  }
  
  ggplot(df_source, aes_string(x="x_pos",y="y_pos",...)) +
  expand_limits(y=c(0,1080), x=c(0,1920)) +
  annotation_raster(map, ymin = 0,ymax=1080,xmin = 0,xmax = 1920) + 
  if(!is.na(override.color)) {
  geom_point(size=point.size, color=override.color)
  } else {
  geom_point(size=point.size)  
  }
}

