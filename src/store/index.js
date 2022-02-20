import axios from 'axios';

export default {
	state: {
		accessToken: '',
		games: [],
		channels: [],
	},

	mutations: {
		SET_ACCESS_TOKEN(state, accessToken) {
			state.accessToken = accessToken;
		},

		SET_GAMES(state, games) {
			state.games = games;
		},

		SET_CHANNELS(state, channels) {
			state.channels = channels;
		},
	},

	actions: {
		setAccessToken({ commit }, accessToken) {
			commit('SET_ACCESS_TOKEN', accessToken);
		},

		setGames({ commit }, games) {
			commit('SET_GAMES', games);
		},

		setChannels({ commit }, channels) {
			commit('SET_CHANNELS', channels);
		},

		async setTop10Games({ commit, getters }) {
			try {
				this.pagination = {};
				const response = await axios.get(
					`https://api.twitch.tv/helix/games/top`,
					{
						headers: getters.getHeaders,
					}
				);
				await commit('SET_GAMES', response.data.data.splice(0, 10));
			} catch (err) {
				console.log(err);
			}
		},

		async setTop10Channels({ commit, getters }) {
			try {
				this.pagination = {};
				const response = await axios.get(
					`https://api.twitch.tv/helix/streams`,
					{
						headers: getters.getHeaders,
					}
				);
				await commit('SET_CHANNELS', response.data.data.splice(0, 10));
			} catch (err) {
				console.log(err);
			}
		},
	},

	getters: {
		getHeaders(state) {
			return {
				Authorization: `Bearer ${state.accessToken}`,
				'Client-Id': process.env.VUE_APP_CLIENT_ID,
			};
		},

		getAccessToken(state) {
			return state.accessToken;
		},

		getGames(state) {
			return state.games;
		},

		getChannels(state) {
			return state.channels;
		},
	},
};
