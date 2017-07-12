<template>
    <div class="ratings" ref="ratingsWrapper">
    	<div class="ratings-content">
    		<div class="overview">
    			<div class="overview-left">
    				<h1 class="score">{{seller.score}}</h1>
    				<div class="title">综合评分</div>
    				<div class="rank">高于周边商家{{seller.rankRate}}%</div>
    			</div>
    			<div class="overview-right">
    				<div class="score-wrapper">
    					<span class="title">服务态度</span>
    					<star :size="36" :score="seller.serviceScore"></star>
    					<span class="score">{{seller.serviceScore}}</span>
    				</div>
    				<div class="score-wrapper">
    					<span class="title">商品评分</span>
    					<star :size="36" :score="seller.foodScore"></star>
    					<span class="score">{{seller.foodScore}}</span>
    				</div>
    				<div class="delivery-wrapper">
    					<span class="title">送达时间</span>
    					<span class="delivery">{{seller.deliveryTime}}分钟</span>
    				</div>
    			</div>
    		</div>
    		<split></split>
    		<ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
    		<div class="rating-wrapper">
				<ul v-if="ratings.length">
					<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{seller.deliveryTime}}分钟</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommand" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend" class="item">{{item}}</span>
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
						</div>
					</li>
				</ul>
				<div v-else class="no-rating">暂无评价</div>
			</div>
    	</div>
    </div>
</template>

<script>
	import jroll from 'JRoll';
	import star from 'components/star/star';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	import formatDate from 'common/js/date';

	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	const ERR_OK = 0;

    export default {
    	props: {
    		seller: {
    			type: Object
    		}
    	},
    	data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				ratings: []
			}
		},
		created() {
			this.$ajax.get('./api/ratings')
			.then(res => {
				this.ratings = res.data.data;
				console.log(this.ratings);

				this.$nextTick(() => {
					this.ratingsScroll = new JRoll(this.$refs.ratingsWrapper, {});
				})
				
			})
			.catch(error => {
				console.log(error);
			});
			this.$root.eventHub.$on('select.type', this.changeSelect);

		},
		methods: {
			needShow(type, text) {
				if(this.onlyContent && !text) {
					return false;
				}
				if(this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			},
			changeSelect(item) {
				if(typeof(item.selectType) == 'number') {
					this.selectType = item.selectType;
				}
				if(typeof(item.onlyContent) == 'boolean') {
					this.onlyContent = item.onlyContent;
				}
				this.$nextTick(() => {
					this.ratingsScroll.refresh();
				})
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
    	components: {
    		star,
    		split,
    		ratingselect
    	}
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";
	.ratings
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		right: 0
		overflow: hidden
		.overview
			display: flex
			padding: 18px 0
			.overview-left
				flex: 0 0 137px
				width: 137px
				border-right: 1px solid rgba(7, 17, 27, 0.1)
				text-align: center
				@media only screen and (max-width: 320px) 
					flex: 0 0 120px
					width: 120px
				.score
					margin-bottom: 6px
					line-height: 28px
					font-size: 24px
					color: rgb(255, 153, 0)
				.title
					margin-bottom: 8px
					line-height: 12px
					font-size: 12px
					color: rgb(7, 17, 27)
				.rank
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
			.overview-right
				flex: 1
				padding-left: 24px
				@media only screen and (max-width: 320px)
					padding-left: 6px
				.score-wrapper
					margin-bottom: 8px
					font-size: 0
					.title
						font-size: 12px
						color: rgb(7, 17, 27)
						line-height: 18px
						vertical-align: top
						font-size: 12px
					.star
						display: inline-block
						vertical-align: top
						margin: 0 12px
					.score
						display: inline-block
						line-height: 18px
						vertical-align: top
						font-size: 12px
						color: rgb(255, 153, 0)
				.delivery-wrapper
					font-size: 12px
					line-height: 18px
					.title
						color: rgb(7, 17, 27)
					.delivery
						color: rgb(147, 153, 159)
						margin-left: 12px
		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
				.avatar
					flex: 0 0 28px
					width: 28px
					margin-right: 12px
					img
						border-radius: 50%
				.content
					flex: 1
					position: relative
					.name
						font-size: 10px
						color: rgb(7, 17, 27)
						line-height: 12px
						margin-bottom: 4px
					.star-wrapper
						margin-bottom: 6px
						.star
							margin-right: 6px
							display: inline-block
						.delivery
							font-size: 10px
							font-weight: 200
							line-height: 12px
							color: rgb(147, 153, 159)
					.text
						font-size: 12px
						color: rgb(7, 17, 27)
						line-height: 18px
						margin-bottom: 8px
					.recommand
						line-height: 16px
						font-size: 0
						.icon-thumb_up, .item
							display: inline-block							
							font-size: 9px
							margin: 0 8px 4px 0
						.icon-thumb_up
							color: rgb(0, 160, 220)
						.item
							line-height: 16px
							color: rgb(147, 153, 159)
							border-radius: 1px
							border: 1px solid rgba(7, 17, 27, 0.1)
							padding: 0 6px
					.time
						font-size: 10px
						line-height: 12px
						font-weight: 200
						color: rgb(147, 153, 159)
						position: absolute
						top: 0
						right: 0



				

</style>