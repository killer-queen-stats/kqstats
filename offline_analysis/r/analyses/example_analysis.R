#Libraries
library(dplyr)
library(tidyr)
library(ggplot2)
source('~/repos/kqstats/offline_analysis/r/src_functions.R')
source('~/repos/kqstats/offline_analysis/r/utils.R')

#Read in game data
events <- read_data("~/repos/kqstats/offline_analysis/r/example_data/beta_new_events_games.txt")

game_summary <- game_log(events)

ggplot(game_summary, aes(duration, fill=map)) + geom_density(alpha=0.5)