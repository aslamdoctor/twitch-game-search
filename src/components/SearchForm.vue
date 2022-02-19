<template>
	<form
		action=""
		class="lg:flex gap-8 mb-12"
		@submit.prevent="$emit('form-submitted', search_form_data, false)"
	>
		<div class="basis-1/4 mb-4 lg:mb-0">
			<label class="block mb-1 lg:mb-3" for="">Search</label>
			<input
				class="border border-orange-700 w-full p-3 rounded-md search-box"
				type="text"
				name="search_keyword"
				v-model="search_form_data.search_keyword"
				required
			/>
		</div>
		<div class="basis-1/4 mb-4 lg:mb-0">
			<label class="block mb-1 lg:mb-3" for="">Type</label>
			<select
				name="search_type"
				class="border border-orange-700 w-full p-3 rounded-md"
				v-model="search_form_data.search_type"
			>
				<option value="game">Game / Category</option>
				<option value="channel">Channel</option>
			</select>
		</div>
		<div class="basis-1/4 mb-4 lg:mb-0">
			<label class="block mb-1 lg:mb-3" for="">Status</label>
			<select
				name="search_status"
				v-model="search_form_data.search_status"
				class="border border-orange-700 w-full p-3 rounded-md"
				:disabled="search_form_data.search_type === 'game'"
			>
				<option value="" selected>Any</option>
				<option value="1">Live Only</option>
			</select>
		</div>
		<div class="basis-1/4">
			<label class="hidden lg:block mb-1 lg:mb-3" for="">&nbsp;</label>
			<input
				type="submit"
				value="Submit"
				class="bg-orange-700 hover:bg-orange-800 w-full p-3 rounded-md text-white uppercase cursor-pointer basis-1/2"
			/>
		</div>
	</form>
</template>

<script>
export default {
	name: 'AppSearchForm',
	props: {
		clearSearch: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	data() {
		return {
			search_form_data: {
				search_keyword: '',
				search_type: 'game',
				search_status: '',
			},
		};
	},
	watch: {
		clearSearch() {
			this.search_form_data = {
				search_keyword: '',
				search_type: 'game',
				search_status: '',
			};
		},
	},
	methods: {},
};
</script>

<style scoped>
.search-box {
	background: url(../assets/icon-search.svg) left 10px center no-repeat;
	background-size: 20px auto;
	padding-left: 40px;
}
select {
	appearance: none;
	background: url(../assets/icon-cheveron-down.svg) right 5px center no-repeat;
	background-size: 30px auto;
}
</style>
