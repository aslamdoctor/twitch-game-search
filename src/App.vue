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
				:games="gamesData"
				v-if="gamesData.length > 0"
			/>

			<AppStreamList
				:title="streamListTitle"
				:streams="streamsData"
				v-if="streamsData.length > 0"
			/>

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
			access_token: '',
			gameListTitle: 'Top 10 Games',
			streamListTitle: 'Top 10 Streams',
			gamesData: [],
			streamsData: [],
			pagination: {},
			searchFormData: {},
			clearSearchProp: false,
		};
	},
	async created() {
		try {
			const response = await axios.post(`https://id.twitch.tv/oauth2/token`, {
				client_id: process.env.VUE_APP_CLIENT_ID,
				client_secret: process.env.VUE_APP_CLIENT_SECRET,
				grant_type: 'client_credentials',
			});
			this.access_token = await response.data.access_token;
			this.getTop10Games();
			this.getTop10Streams();
		} catch (err) {
			console.log(err);
		}
	},
	methods: {
		// Get Top 10 Games
		async getTop10Games() {
			try {
				this.pagination = {};
				const response = await axios.get(
					`https://api.twitch.tv/helix/games/top`,
					{
						headers: {
							Authorization: `Bearer ${this.access_token}`,
							'Client-Id': process.env.VUE_APP_CLIENT_ID,
						},
					}
				);
				this.gamesData = response.data.data.splice(0, 10);
			} catch (err) {
				console.log(err);
			}
		},

		// Get Top 10 Streams
		async getTop10Streams() {
			try {
				this.pagination = {};
				const response = await axios.get(
					`https://api.twitch.tv/helix/streams`,
					{
						headers: {
							Authorization: `Bearer ${this.access_token}`,
							'Client-Id': process.env.VUE_APP_CLIENT_ID,
						},
					}
				);
				this.streamsData = response.data.data.splice(0, 10);
			} catch (err) {
				console.log(err);
			}
		},

		// Clear Search
		clearSearch() {
			this.searchFormData = {};
			this.getTop10Games();
			this.getTop10Streams();
			this.gameListTitle = 'Top 10 Games';
			this.streamListTitle = 'Top 10 Streams';
			this.clearSearchProp = true;
		},

		// Search Games or Streams
		async searchGames(search_form_data, loadMore) {
			this.searchFormData = search_form_data;

			if (!loadMore) {
				this.gamesData = [];
				this.streamsData = [];
			}

			if (search_form_data.search_type == 'game') {
				try {
					const params = { query: search_form_data.search_keyword };
					if (loadMore) {
						params.after = this.pagination.cursor;
					}
					const response = await axios.get(
						`https://api.twitch.tv/helix/search/categories`,
						{
							params: params,
							headers: {
								Authorization: `Bearer ${this.access_token}`,
								'Client-Id': process.env.VUE_APP_CLIENT_ID,
							},
						}
					);

					if (!loadMore) this.gamesData = response.data.data;
					else this.gamesData = this.gamesData.concat(response.data.data);

					this.gameListTitle = `Games: ${search_form_data.search_keyword}`;
					if (response.data.pagination)
						this.pagination = response.data.pagination;
				} catch (err) {
					console.log(err);
				}
			}
			if (search_form_data.search_type == 'channel') {
				console.log(search_form_data);
				try {
					const params = {
						query: search_form_data.search_keyword,
						live_only: search_form_data.search_status ? true : false,
					};
					if (loadMore) {
						params.after = this.pagination.cursor;
					}
					const response = await axios.get(
						`https://api.twitch.tv/helix/search/channels`,
						{
							params: params,
							headers: {
								Authorization: `Bearer ${this.access_token}`,
								'Client-Id': process.env.VUE_APP_CLIENT_ID,
							},
						}
					);

					if (!loadMore) this.streamsData = response.data.data;
					else this.streamsData = this.streamsData.concat(response.data.data);

					this.streamListTitle = `Streams: ${search_form_data.search_keyword}`;
					if (response.data.pagination)
						this.pagination = response.data.pagination;
				} catch (err) {
					console.log(err);
				}
			}
		},
	},
};
</script>
