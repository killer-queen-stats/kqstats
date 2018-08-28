#Working functions

read_data <- function(file) {
  r <- read.table(file, sep="!", skipNul=TRUE, skip=1)[,2]
  event_data <- .event_log(r)
  return(event_data)
}

.extract <- function(x, pos) {
  pos <- paste0("\\", pos)
  sub(extraction_regex, pos, x)
}

.event_log <- function(log) {
  game_id <- cumsum(grepl("gamestart", log))
  
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
  return(cbind.data.frame(e, d))
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

bonus_games <- function() sort(unique(c(bonus_game_pos_check(event_log), bonus_game_kill_check(event_log))))

event_exports <- function(event_log, event_fields_list) {
  event_exports <- list()
  
  for(i in 1:length(event_fields_list)) {
    export_df <- split_to_df(event_log, names(event_fields_list)[i])
    export_df <- export_df[,-4]
    event_exports[[i]] <- export_df
  }
  
  return(event_exports)
}
