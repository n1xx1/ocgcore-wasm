import { makeMap } from "./internal/utils";
import {
  OcgAttribute,
  OcgDuelMode,
  OcgHintTiming,
  OcgHintType,
  OcgLinkMarker,
  OcgLocation,
  OcgLogType,
  OcgPhase,
  OcgPosition,
  OcgProcessResult,
  OcgQueryFlags,
  OcgRPS,
  OcgRace,
  OcgScope,
  OcgType,
} from "./type_core";
import {
  OcgCardHintType,
  OcgEffectClientMode,
  OcgMessageType,
  OcgPlayerHintType,
} from "./type_message";
import {
  OcgResponseType,
  SelectBattleCMDAction,
  SelectIdleCMDAction,
} from "./type_response";

/**
 * Convert a {@link OcgEffectClientMode} to its string representation.
 */
export const ocgEffectClientModeStrings = makeMap([
  [OcgEffectClientMode.NORMAL, "normal"],
  [OcgEffectClientMode.RESOLVE, "resolve"],
  [OcgEffectClientMode.RESET, "reset"],
]);

/**
 * Convert a {@link OcgCardHintType} to its string representation.
 */
export const ocgCardHintTypeStrings = makeMap([
  [OcgCardHintType.TURN, "turn"],
  [OcgCardHintType.CARD, "card"],
  [OcgCardHintType.RACE, "race"],
  [OcgCardHintType.ATTRIBUTE, "attribute"],
  [OcgCardHintType.NUMBER, "number"],
  [OcgCardHintType.DESC_ADD, "desc_add"],
  [OcgCardHintType.DESC_REMOVE, "desc_remove"],
]);

/**
 * Convert a {@link OcgPlayerHintType} to its string representation.
 */
export const ocgPlayerHintTypeStrings = makeMap([
  [OcgPlayerHintType.DESC_ADD, "desc_add"],
  [OcgPlayerHintType.DESC_REMOVE, "desc_remove"],
]);

/**
 * Convert a {@link OcgMessageType} to its string representation.
 */
export const ocgMessageTypeStrings = makeMap([
  [OcgMessageType.RETRY, "retry"],
  [OcgMessageType.HINT, "hint"],
  [OcgMessageType.WAITING, "waiting"],
  [OcgMessageType.START, "start"],
  [OcgMessageType.WIN, "win"],
  [OcgMessageType.UPDATE_DATA, "update_data"],
  [OcgMessageType.UPDATE_CARD, "update_card"],
  [OcgMessageType.REQUEST_DECK, "request_deck"],
  [OcgMessageType.SELECT_BATTLECMD, "select_battlecmd"],
  [OcgMessageType.SELECT_IDLECMD, "select_idlecmd"],
  [OcgMessageType.SELECT_EFFECTYN, "select_effectyn"],
  [OcgMessageType.SELECT_YESNO, "select_yesno"],
  [OcgMessageType.SELECT_OPTION, "select_option"],
  [OcgMessageType.SELECT_CARD, "select_card"],
  [OcgMessageType.SELECT_CHAIN, "select_chain"],
  [OcgMessageType.SELECT_PLACE, "select_place"],
  [OcgMessageType.SELECT_POSITION, "select_position"],
  [OcgMessageType.SELECT_TRIBUTE, "select_tribute"],
  [OcgMessageType.SORT_CHAIN, "sort_chain"],
  [OcgMessageType.SELECT_COUNTER, "select_counter"],
  [OcgMessageType.SELECT_SUM, "select_sum"],
  [OcgMessageType.SELECT_DISFIELD, "select_disfield"],
  [OcgMessageType.SORT_CARD, "sort_card"],
  [OcgMessageType.SELECT_UNSELECT_CARD, "select_unselect_card"],
  [OcgMessageType.CONFIRM_DECKTOP, "confirm_decktop"],
  [OcgMessageType.CONFIRM_CARDS, "confirm_cards"],
  [OcgMessageType.SHUFFLE_DECK, "shuffle_deck"],
  [OcgMessageType.SHUFFLE_HAND, "shuffle_hand"],
  [OcgMessageType.REFRESH_DECK, "refresh_deck"],
  [OcgMessageType.SWAP_GRAVE_DECK, "swap_grave_deck"],
  [OcgMessageType.SHUFFLE_SET_CARD, "shuffle_set_card"],
  [OcgMessageType.REVERSE_DECK, "reverse_deck"],
  [OcgMessageType.DECK_TOP, "deck_top"],
  [OcgMessageType.SHUFFLE_EXTRA, "shuffle_extra"],
  [OcgMessageType.NEW_TURN, "new_turn"],
  [OcgMessageType.NEW_PHASE, "new_phase"],
  [OcgMessageType.CONFIRM_EXTRATOP, "confirm_extratop"],
  [OcgMessageType.MOVE, "move"],
  [OcgMessageType.POS_CHANGE, "pos_change"],
  [OcgMessageType.SET, "set"],
  [OcgMessageType.SWAP, "swap"],
  [OcgMessageType.FIELD_DISABLED, "field_disabled"],
  [OcgMessageType.SUMMONING, "summoning"],
  [OcgMessageType.SUMMONED, "summoned"],
  [OcgMessageType.SPSUMMONING, "spsummoning"],
  [OcgMessageType.SPSUMMONED, "spsummoned"],
  [OcgMessageType.FLIPSUMMONING, "flipsummoning"],
  [OcgMessageType.FLIPSUMMONED, "flipsummoned"],
  [OcgMessageType.CHAINING, "chaining"],
  [OcgMessageType.CHAINED, "chained"],
  [OcgMessageType.CHAIN_SOLVING, "chain_solving"],
  [OcgMessageType.CHAIN_SOLVED, "chain_solved"],
  [OcgMessageType.CHAIN_END, "chain_end"],
  [OcgMessageType.CHAIN_NEGATED, "chain_negated"],
  [OcgMessageType.CHAIN_DISABLED, "chain_disabled"],
  [OcgMessageType.CARD_SELECTED, "card_selected"],
  [OcgMessageType.RANDOM_SELECTED, "random_selected"],
  [OcgMessageType.BECOME_TARGET, "become_target"],
  [OcgMessageType.DRAW, "draw"],
  [OcgMessageType.DAMAGE, "damage"],
  [OcgMessageType.RECOVER, "recover"],
  [OcgMessageType.EQUIP, "equip"],
  [OcgMessageType.LPUPDATE, "lpupdate"],
  [OcgMessageType.CARD_TARGET, "card_target"],
  [OcgMessageType.CANCEL_TARGET, "cancel_target"],
  [OcgMessageType.PAY_LPCOST, "pay_lpcost"],
  [OcgMessageType.ADD_COUNTER, "add_counter"],
  [OcgMessageType.REMOVE_COUNTER, "remove_counter"],
  [OcgMessageType.ATTACK, "attack"],
  [OcgMessageType.BATTLE, "battle"],
  [OcgMessageType.ATTACK_DISABLED, "attack_disabled"],
  [OcgMessageType.DAMAGE_STEP_START, "damage_step_start"],
  [OcgMessageType.DAMAGE_STEP_END, "damage_step_end"],
  [OcgMessageType.MISSED_EFFECT, "missed_effect"],
  [OcgMessageType.BE_CHAIN_TARGET, "be_chain_target"],
  [OcgMessageType.CREATE_RELATION, "create_relation"],
  [OcgMessageType.RELEASE_RELATION, "release_relation"],
  [OcgMessageType.TOSS_COIN, "toss_coin"],
  [OcgMessageType.TOSS_DICE, "toss_dice"],
  [OcgMessageType.ROCK_PAPER_SCISSORS, "rock_paper_scissors"],
  [OcgMessageType.HAND_RES, "hand_res"],
  [OcgMessageType.ANNOUNCE_RACE, "announce_race"],
  [OcgMessageType.ANNOUNCE_ATTRIB, "announce_attrib"],
  [OcgMessageType.ANNOUNCE_CARD, "announce_card"],
  [OcgMessageType.ANNOUNCE_NUMBER, "announce_number"],
  [OcgMessageType.CARD_HINT, "card_hint"],
  [OcgMessageType.TAG_SWAP, "tag_swap"],
  [OcgMessageType.RELOAD_FIELD, "reload_field"],
  [OcgMessageType.AI_NAME, "ai_name"],
  [OcgMessageType.SHOW_HINT, "show_hint"],
  [OcgMessageType.PLAYER_HINT, "player_hint"],
  [OcgMessageType.MATCH_KILL, "match_kill"],
  [OcgMessageType.CUSTOM_MSG, "custom_msg"],
  [OcgMessageType.REMOVE_CARDS, "remove_cards"],
]);

/**
 * Convert a {@link OcgResponseType} to its string representation.
 */
export const responseTypeStrings = makeMap([
  [OcgResponseType.SELECT_BATTLECMD, "select_battlecmd"],
  [OcgResponseType.SELECT_IDLECMD, "select_idlecmd"],
  [OcgResponseType.SELECT_EFFECTYN, "select_effectyn"],
  [OcgResponseType.SELECT_YESNO, "select_yesno"],
  [OcgResponseType.SELECT_OPTION, "select_option"],
  [OcgResponseType.SELECT_CARD, "select_card"],
  [OcgResponseType.SELECT_CARD_CODES, "select_card_codes"],
  [OcgResponseType.SELECT_UNSELECT_CARD, "select_unselect_card"],
  [OcgResponseType.SELECT_CHAIN, "select_chain"],
  [OcgResponseType.SELECT_DISFIELD, "select_disfield"],
  [OcgResponseType.SELECT_PLACE, "select_place"],
  [OcgResponseType.SELECT_POSITION, "select_position"],
  [OcgResponseType.SELECT_TRIBUTE, "select_tribute"],
  [OcgResponseType.SELECT_COUNTER, "select_counter"],
  [OcgResponseType.SELECT_SUM, "select_sum"],
  [OcgResponseType.SORT_CARD, "sort_card"],
  [OcgResponseType.ANNOUNCE_RACE, "announce_race"],
  [OcgResponseType.ANNOUNCE_ATTRIB, "announce_attrib"],
  [OcgResponseType.ANNOUNCE_CARD, "announce_card"],
  [OcgResponseType.ANNOUNCE_NUMBER, "announce_number"],
  [OcgResponseType.ROCK_PAPER_SCISSORS, "rock_paper_scissors"],
]);

/**
 * Convert a {@link SelectBattleCMDAction} to its string representation.
 */
export const selectBattleCMDActionStrings = makeMap([
  [SelectBattleCMDAction.SELECT_CHAIN, "select_chain"],
  [SelectBattleCMDAction.SELECT_BATTLE, "select_battle"],
  [SelectBattleCMDAction.TO_M2, "to_m2"],
  [SelectBattleCMDAction.TO_EP, "to_ep"],
]);

/**
 * Convert a {@link SelectIdleCMDAction} to its string representation.
 */
export const selectIdleCMDActionStrings = makeMap([
  [SelectIdleCMDAction.SELECT_SUMMON, "select_summon"],
  [SelectIdleCMDAction.SELECT_SPECIAL_SUMMON, "select_special_summon"],
  [SelectIdleCMDAction.SELECT_POS_CHANGE, "select_pos_change"],
  [SelectIdleCMDAction.SELECT_MONSTER_SET, "select_monster_set"],
  [SelectIdleCMDAction.SELECT_SPELL_SET, "select_spell_set"],
  [SelectIdleCMDAction.SELECT_ACTIVATE, "select_activate"],
  [SelectIdleCMDAction.TO_BP, "to_bp"],
  [SelectIdleCMDAction.TO_EP, "to_ep"],
  [SelectIdleCMDAction.SHUFFLE, "shuffle"],
]);

/**
 * Convert a {@link (OcgQueryFlags:type)} to its string representation.
 */
export const ocgQueryFlagsString = makeMap([
  [OcgQueryFlags.CODE, "code"],
  [OcgQueryFlags.POSITION, "position"],
  [OcgQueryFlags.ALIAS, "alias"],
  [OcgQueryFlags.TYPE, "type"],
  [OcgQueryFlags.LEVEL, "level"],
  [OcgQueryFlags.RANK, "rank"],
  [OcgQueryFlags.ATTRIBUTE, "attribute"],
  [OcgQueryFlags.RACE, "race"],
  [OcgQueryFlags.ATTACK, "attack"],
  [OcgQueryFlags.DEFENSE, "defense"],
  [OcgQueryFlags.BASE_ATTACK, "base_attack"],
  [OcgQueryFlags.BASE_DEFENSE, "base_defense"],
  [OcgQueryFlags.REASON, "reason"],
  [OcgQueryFlags.REASON_CARD, "reason_card"],
  [OcgQueryFlags.EQUIP_CARD, "equip_card"],
  [OcgQueryFlags.TARGET_CARD, "target_card"],
  [OcgQueryFlags.OVERLAY_CARD, "overlay_card"],
  [OcgQueryFlags.COUNTERS, "counters"],
  [OcgQueryFlags.OWNER, "owner"],
  [OcgQueryFlags.STATUS, "status"],
  [OcgQueryFlags.IS_PUBLIC, "is_public"],
  [OcgQueryFlags.LSCALE, "lscale"],
  [OcgQueryFlags.RSCALE, "rscale"],
  [OcgQueryFlags.LINK, "link"],
  [OcgQueryFlags.IS_HIDDEN, "is_hidden"],
  [OcgQueryFlags.COVER, "cover"],
]);

/**
 * Convert a {@link (OcgScope:type)} to its string representation.
 */
export const ocgScopeString = makeMap([
  [OcgScope.OCG, "ocg"],
  [OcgScope.TCG, "tcg"],
  [OcgScope.ANIME, "anime"],
  [OcgScope.ILLEGAL, "illegal"],
  [OcgScope.VIDEO_GAME, "video_game"],
  [OcgScope.CUSTOM, "custom"],
  [OcgScope.SPEED, "speed"],
  [OcgScope.PRERELEASE, "prerelease"],
  [OcgScope.RUSH, "rush"],
  [OcgScope.LEGEND, "legend"],
  [OcgScope.HIDDEN, "hidden"],
]);

/**
 * Convert a {@link (OcgProcessResult:type)} to its string representation.
 */
export const ocgProcessResultString = makeMap([
  [OcgProcessResult.END, "end"],
  [OcgProcessResult.WAITING, "waiting"],
  [OcgProcessResult.CONTINUE, "continue"],
]);

/**
 * Convert a {@link (OcgPosition:type)} to its string representation.
 */
export const ocgPositionString = makeMap([
  [OcgPosition.FACEUP_ATTACK, "faceup_attack"],
  [OcgPosition.FACEDOWN_ATTACK, "facedown_attack"],
  [OcgPosition.FACEUP_DEFENSE, "faceup_defense"],
  [OcgPosition.FACEDOWN_DEFENSE, "facedown_defense"],
  [OcgPosition.FACEUP, "faceup"],
  [OcgPosition.FACEDOWN, "facedown"],
  [OcgPosition.ATTACK, "attack"],
  [OcgPosition.DEFENSE, "defense"],
]);

/**
 * Convert a {@link (OcgLocation:type)} to its string representation.
 */
export const ocgLocationString = makeMap([
  [OcgLocation.DECK, "deck"],
  [OcgLocation.HAND, "hand"],
  [OcgLocation.MZONE, "mzone"],
  [OcgLocation.SZONE, "szone"],
  [OcgLocation.GRAVE, "grave"],
  [OcgLocation.REMOVED, "removed"],
  [OcgLocation.EXTRA, "extra"],
  [OcgLocation.OVERLAY, "overlay"],
  [OcgLocation.FZONE, "fzone"],
  [OcgLocation.PZONE, "pzone"],
  [OcgLocation.ONFIELD, "onfield"],
  [OcgLocation.ALL, "all"],
]);

/**
 * Convert a {@link (OcgType:type)} to its string representation.
 */
export const ocgTypeString = makeMap([
  [OcgType.MONSTER, "monster"],
  [OcgType.SPELL, "spell"],
  [OcgType.TRAP, "trap"],
  [OcgType.NORMAL, "normal"],
  [OcgType.EFFECT, "effect"],
  [OcgType.FUSION, "fusion"],
  [OcgType.RITUAL, "ritual"],
  [OcgType.TRAPMONSTER, "trapmonster"],
  [OcgType.SPIRIT, "spirit"],
  [OcgType.UNION, "union"],
  [OcgType.GEMINI, "gemini"],
  [OcgType.TUNER, "tuner"],
  [OcgType.SYNCHRO, "synchro"],
  [OcgType.TOKEN, "token"],
  [OcgType.MAXIMUM, "maximum"],
  [OcgType.QUICKPLAY, "quickplay"],
  [OcgType.CONTINUOUS, "continuous"],
  [OcgType.EQUIP, "equip"],
  [OcgType.FIELD, "field"],
  [OcgType.COUNTER, "counter"],
  [OcgType.FLIP, "flip"],
  [OcgType.TOON, "toon"],
  [OcgType.XYZ, "xyz"],
  [OcgType.PENDULUM, "pendulum"],
  [OcgType.SPSUMMON, "spsummon"],
  [OcgType.LINK, "link"],
]);

/**
 * Convert a {@link (OcgAttribute:type)} to its string representation.
 */
export const ocgAttributeString = makeMap([
  [OcgAttribute.EARTH, "earth"],
  [OcgAttribute.WATER, "water"],
  [OcgAttribute.FIRE, "fire"],
  [OcgAttribute.WIND, "wind"],
  [OcgAttribute.LIGHT, "light"],
  [OcgAttribute.DARK, "dark"],
  [OcgAttribute.DIVINE, "divine"],
]);

/**
 * Convert a {@link (OcgRace:type)} to its string representation.
 */
export const ocgRaceString = makeMap([
  [OcgRace.WARRIOR, "warrior"],
  [OcgRace.SPELLCASTER, "spellcaster"],
  [OcgRace.FAIRY, "fairy"],
  [OcgRace.FIEND, "fiend"],
  [OcgRace.ZOMBIE, "zombie"],
  [OcgRace.MACHINE, "machine"],
  [OcgRace.AQUA, "aqua"],
  [OcgRace.PYRO, "pyro"],
  [OcgRace.ROCK, "rock"],
  [OcgRace.WINGEDBEAST, "winged_beast"],
  [OcgRace.PLANT, "plant"],
  [OcgRace.INSECT, "insect"],
  [OcgRace.THUNDER, "thunder"],
  [OcgRace.DRAGON, "dragon"],
  [OcgRace.BEAST, "beast"],
  [OcgRace.BEASTWARRIOR, "beast_warrior"],
  [OcgRace.DINOSAUR, "dinosaur"],
  [OcgRace.FISH, "fish"],
  [OcgRace.SEASERPENT, "sea_serpent"],
  [OcgRace.REPTILE, "reptile"],
  [OcgRace.PSYCHIC, "psychic"],
  [OcgRace.DIVINE, "divine"],
  [OcgRace.CREATORGOD, "creator_god"],
  [OcgRace.WYRM, "wyrm"],
  [OcgRace.CYBERSE, "cyberse"],
  [OcgRace.ILLUSION, "illusion"],
  [OcgRace.CYBORG, "cyborg"],
  [OcgRace.MAGICALKNIGHT, "magical_knight"],
  [OcgRace.HIGHDRAGON, "high_dragon"],
  [OcgRace.OMEGAPSYCHIC, "omega_psychic"],
  [OcgRace.CELESTIALWARRIOR, "celestial_warrior"],
  [OcgRace.GALAXY, "galaxy"],
]);

/**
 * Convert a {@link (OcgLinkMarker:type)} to its string representation.
 */
export const ocgLinkMarkerString = makeMap([
  [OcgLinkMarker.BOTTOM_LEFT, "bottom_left"],
  [OcgLinkMarker.BOTTOM, "bottom"],
  [OcgLinkMarker.BOTTOM_RIGHT, "bottom_right"],
  [OcgLinkMarker.LEFT, "left"],
  [OcgLinkMarker.RIGHT, "right"],
  [OcgLinkMarker.TOP_LEFT, "top_left"],
  [OcgLinkMarker.TOP, "top"],
  [OcgLinkMarker.TOP_RIGHT, "top_right"],
]);

/**
 * Convert a {@link (OcgRPS:type)} to its string representation.
 */
export const ocgRPSString = makeMap([
  [OcgRPS.SCISSORS, "scissors"],
  [OcgRPS.ROCK, "rock"],
  [OcgRPS.PAPER, "paper"],
]);

/**
 * Convert a {@link (OcgDuelMode:type)} to its string representation.
 */
export const ocgDuelModeString = makeMap([
  [OcgDuelMode.TEST_MODE, "test_mode"],
  [OcgDuelMode.ATTACK_FIRST_TURN, "attack_first_turn"],
  [OcgDuelMode.USE_TRAPS_IN_NEW_CHAIN, "use_traps_in_new_chain"],
  [OcgDuelMode.SIX_STEP_BATLLE_STEP, "six_step_batlle_step"],
  [OcgDuelMode.PSEUDO_SHUFFLE, "pseudo_shuffle"],
  [
    OcgDuelMode.TRIGGER_WHEN_PRIVATE_KNOWLEDGE,
    "trigger_when_private_knowledge",
  ],
  [OcgDuelMode.SIMPLE_AI, "simple_ai"],
  [OcgDuelMode.RELAY, "relay"],
  [OcgDuelMode.OBSOLETE_IGNITION, "obsolete_ignition"],
  [OcgDuelMode.FIRST_TURN_DRAW, "first_turn_draw"],
  [OcgDuelMode.ONE_FACEUP_FIELD, "one_faceup_field"],
  [OcgDuelMode.PZONE, "pzone"],
  [OcgDuelMode.SEPARATE_PZONE, "separate_pzone"],
  [OcgDuelMode.EMZONE, "emzone"],
  [OcgDuelMode.FSX_MMZONE, "fsx_mmzone"],
  [OcgDuelMode.TRAP_MONSTERS_NOT_USE_ZONE, "trap_monsters_not_use_zone"],
  [OcgDuelMode.RETURN_TO_DECK_TRIGGERS, "return_to_extra_deck_triggers"],
  [OcgDuelMode.TRIGGER_ONLY_IN_LOCATION, "trigger_only_in_location"],
  [OcgDuelMode.SPSUMMON_ONCE_OLD_NEGATE, "spsummon_once_old_negate"],
  [OcgDuelMode.CANNOT_SUMMON_OATH_OLD, "cannot_summon_oath_old"],
  [OcgDuelMode.NO_STANDBY_PHASE, "no_standby_phase"],
  [OcgDuelMode.NO_MAIN_PHASE_2, "no_main_phase_2"],
  [OcgDuelMode.THREE_COLUMNS_FIELD, "three_columns_field"],
  [OcgDuelMode.DRAW_UNTIL_5, "draw_until_5"],
  [OcgDuelMode.NO_HAND_LIMIT, "no_hand_limit"],
  [OcgDuelMode.UNLIMITED_SUMMONS, "unlimited_summons"],
  [OcgDuelMode.INVERTED_QUICK_PRIORITY, "inverted_quick_priority"],
  [
    OcgDuelMode.EQUIP_NOT_SENT_IF_MISSING_TARGET,
    "equip_not_sent_if_missing_target",
  ],
  [OcgDuelMode.ZERO_ATK_DESTROYED, "zero_atk_destroyed"],
  [OcgDuelMode.STORE_ATTACK_REPLAYS, "store_attack_replays"],
  [
    OcgDuelMode.SINGLE_CHAIN_IN_DAMAGE_SUBSTEP,
    "single_chain_in_damage_substep",
  ],
  [OcgDuelMode.CAN_REPOS_IF_NON_SUMPLAYER, "can_repos_if_non_sumplayer"],
  [OcgDuelMode.TCG_SEGOC_NONPUBLIC, "tcg_segoc_nonpublic"],
  [OcgDuelMode.TCG_SEGOC_FIRSTTRIGGER, "tcg_segoc_firsttrigger"],
  [OcgDuelMode.MODE_SPEED, "mode_speed"],
  [OcgDuelMode.MODE_RUSH, "mode_rush"],
  [OcgDuelMode.MODE_GOAT, "mode_goat"],
  [OcgDuelMode.MODE_MR2, "mode_mr2"],
  [OcgDuelMode.MODE_MR3, "mode_mr3"],
  [OcgDuelMode.MODE_MR4, "mode_mr4"],
  [OcgDuelMode.MODE_MR5, "mode_mr5"],
]);

/**
 * Convert a {@link (OcgLogType:type)} to its string representation.
 */
export const ocgLogTypeString = makeMap([
  [OcgLogType.ERROR, "error"],
  [OcgLogType.FROM_SCRIPT, "from_script"],
  [OcgLogType.FOR_DEBUG, "for_debug"],
  [OcgLogType.UNDEFINED, "undefined"],
]);

/**
 * Convert a {@link (OcgPhase:type)} to its string representation.
 */
export const ocgPhaseString = makeMap([
  [OcgPhase.DRAW, "draw"],
  [OcgPhase.STANDBY, "standby"],
  [OcgPhase.MAIN1, "main1"],
  [OcgPhase.BATTLE_START, "battle_start"],
  [OcgPhase.BATTLE_STEP, "battle_step"],
  [OcgPhase.DAMAGE, "damage"],
  [OcgPhase.DAMAGE_CAL, "damage_cal"],
  [OcgPhase.BATTLE, "battle"],
  [OcgPhase.MAIN2, "main2"],
  [OcgPhase.END, "end"],
]);

/**
 * Convert a {@link (OcgHintType:type)} to its string representation.
 */
export const ocgHintString = makeMap([
  [OcgHintType.EVENT, "event"],
  [OcgHintType.MESSAGE, "message"],
  [OcgHintType.SELECTMSG, "selectmsg"],
  [OcgHintType.OPSELECTED, "opselected"],
  [OcgHintType.EFFECT, "effect"],
  [OcgHintType.RACE, "race"],
  [OcgHintType.ATTRIB, "attrib"],
  [OcgHintType.CODE, "code"],
  [OcgHintType.NUMBER, "number"],
  [OcgHintType.CARD, "card"],
  [OcgHintType.ZONE, "zone"],
]);

/**
 * Convert a {@link (OcgHintTiming:type)} to its string representation.
 */
export const ocgHintTimingString = makeMap([
  [OcgHintTiming.DRAW_PHASE, "draw_phase"],
  [OcgHintTiming.STANDBY_PHASE, "standby_phase"],
  [OcgHintTiming.MAIN_END, "main_end"],
  [OcgHintTiming.BATTLE_START, "battle_start"],
  [OcgHintTiming.BATTLE_END, "battle_end"],
  [OcgHintTiming.END_PHASE, "end_phase"],
  [OcgHintTiming.SUMMON, "summon"],
  [OcgHintTiming.SPSUMMON, "spsummon"],
  [OcgHintTiming.FLIPSUMMON, "flipsummon"],
  [OcgHintTiming.MSET, "mset"],
  [OcgHintTiming.SSET, "sset"],
  [OcgHintTiming.POS_CHANGE, "pos_change"],
  [OcgHintTiming.ATTACK, "attack"],
  [OcgHintTiming.DAMAGE_STEP, "damage_step"],
  [OcgHintTiming.DAMAGE_CAL, "damage_cal"],
  [OcgHintTiming.CHAIN_END, "chain_end"],
  [OcgHintTiming.DRAW, "draw"],
  [OcgHintTiming.DAMAGE, "damage"],
  [OcgHintTiming.RECOVER, "recover"],
  [OcgHintTiming.DESTROY, "destroy"],
  [OcgHintTiming.REMOVE, "remove"],
  [OcgHintTiming.TOHAND, "tohand"],
  [OcgHintTiming.TODECK, "todeck"],
  [OcgHintTiming.TOGRAVE, "tograve"],
  [OcgHintTiming.BATTLE_PHASE, "battle_phase"],
  [OcgHintTiming.EQUIP, "equip"],
  [OcgHintTiming.BATTLE_STEP_END, "battle_step_end"],
  [OcgHintTiming.BATTLED, "battled"],
]);
