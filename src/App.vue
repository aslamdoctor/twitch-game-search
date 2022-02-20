<template>
	<div>
		<AppHeader @clear-search="clearSearch" />
		<div class="container mx-auto mt-4 overflow-hidden px-5">
			<AppSearchForm
				@form-submitted="searchGames"
				:clearSearch="clearSearchProp"
			/>

			<AppGamesList
				:title="gameListTitle"
				:games="getGames"
				v-if="getGames && getGames.length > 0"
			/>

			<AppStreamList
				:title="streamListTitle"
				:streams="getChannels"
				v-if="getChannels && getChannels.length > 0"
			/>

			<div class="flex justify-center mb-5" v-if="loading">
				<svg
					role="status"
					class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			</div>

			<div class="text-center mb-10">
				<button
					class="bg-orange-700 hover:bg-orange-800 px-8 py-3 rounded-md text-white uppercase cursor-pointer"
					v-if="pagination && pagination.cursor"
					@click.prevent="searchGames(searchFormData, true)"
				>
					Show More
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import AppHeader from './components/Header';
import AppSearchForm from './components/SearchForm';
import AppGamesList from './components/GamesList';
import AppStreamList from './components/StreamList';

import axios from 'axios';

export default {
	name: 'App',
	components: {
		AppHeader,
		AppSearchForm,
		AppGamesList,
		AppStreamList,
	},
	data() {
		return {
			gameListTitle: 'Top 10 Games',
			streamListTitle: 'Top 10 Streams',
			pagination: {},
			searchFormData: {},
			clearSearchProp: false,
			loading: false,
		};
	},
	async created() {
		try {
			this.loading = true;
			const response = await axios.post(`https://id.twitch.tv/oauth2/token`, {
				client_id: process.env.VUE_APP_CLIENT_ID,
				client_secret: process.env.VUE_APP_CLIENT_SECRET,
				grant_type: 'client_credentials',
			});
			await this.$store.dispatch('setAccessToken', response.data.access_token);
			await this.getTop10Games();
			await this.getTop10Streams();
			this.loading = false;
		} catch (err) {
			console.log(err);
		}
	},
	computed: {
		authHeaders() {
			return {
				Authorization: `Bearer ${this.$store.getters['getAccessToken']}`,
				'Client-Id': process.env.VUE_APP_CLIENT_ID,
			};
		},

		getGames() {
			return this.$store.getters['getGames'];
		},

		getChannels() {
			return this.$store.getters['getChannels'];
		},
	},
	methods: {
		// Get Top 10 Games
		getTop10Games() {
			this.pagination = {};
			this.$store.dispatch('setTop10Games');
		},

		// Get Top 10 Streams
		async getTop10Streams() {
			this.$store.dispatch('setTop10Channels');
		},

		// Clear Search
		clearSearch() {
			this.searchFormData = {};
			this.getTop10Games();
			this.getTop10Streams();
			this.gameListTitle = 'Top 10 Games';
			this.streamListTitle = 'Top 10 Streams';
			this.clearSearchProp = true;
			this.pagination = {};
		},

		// Search Games or Streams
		async searchGames(search_form_data, loadMore) {
			this.searchFormData = search_form_data;
			this.loading = true;

			if (!loadMore) {
				this.pagination = {};
				this.$store.dispatch('setGames', []);
				this.$store.dispatch('setChannels', []);
			}

			if (search_form_data.type == 'game') {
				try {
					const params = { query: search_form_data.keyword };
					if (loadMore) {
						params.after = this.pagination.cursor;
					}
					const response = await axios.get(
						`https://api.twitch.tv/helix/search/categories`,
						{
							params: params,
							headers: this.authHeaders,
						}
					);

					if (!loadMore) {
						await this.$store.dispatch('setGames', response.data.data);
					} else {
						const gameData = this.$store.getters['getGames'].concat(
							response.data.data
						);
						await this.$store.dispatch('setGames', gameData);
					}

					this.gameListTitle = `Games: ${search_form_data.keyword}`;
					if (response.data.pagination)
						this.pagination = response.data.pagination;

					this.loading = false;
				} catch (err) {
					console.log(err);
				}
			}

			if (search_form_data.type == 'channel') {
				try {
					const params = {
						query: search_form_data.keyword,
						live_only: search_form_data.status ? true : false,
					};
					if (loadMore) {
						params.after = this.pagination.cursor;
					}
					const response = await axios.get(
						`https://api.twitch.tv/helix/search/channels`,
						{
							params: params,
							headers: this.authHeaders,
						}
					);

					if (!loadMore) {
						await this.$store.dispatch('setChannels', response.data.data);
					} else {
						const gameData = this.$store.getters['getChannels'].concat(
							response.data.data
						);
						await this.$store.dispatch('setChannels', gameData);
					}

					this.streamListTitle = `Streams: ${search_form_data.keyword}`;
					if (response.data.pagination)
						this.pagination = response.data.pagination;

					this.loading = false;
				} catch (err) {
					console.log(err);
				}
			}
		},
	},
};
</script>
