<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart">
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script>
	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart(event) {
				if(!this.food.count) {
					this.$set(this.food, 'count', 1)
				}else {
					this.food.count++;
				}
				// Vue 2.0变化：组件通信变化$dispatch废除，事件监听变化，废除events属性，不能在子组件直接修改父组件传入的prop
				// $dispatch是子组件传递方法给父组件，一层一层地冒泡出去
				this.$root.eventHub.$emit('cart.add', event.target);// 把DOM对象当作事件参数传入
			},
			decreaseCart() {
				console.log(this.food.count);
				if(this.food.count) {
					this.food.count--;
				}
			}
		}
	}
</script>

<style lang="stylus">
	.cartcontrol
		font-size: 0
		.cart-decrease, .cart-add
			display: inline-block
			line-height: 24px
			font-size: 24px
			padding: 6px
			color: rgb(0, 160, 220)
		.cart-decrease
			opacity: 1
			transform: translate3d(0, 0, 0) rotate(0)
			&.move-enter-active, &.move-leave-active
				transition: all 0.4s linear
			&.move-enter, &.move-leave-to
				opacity: 0
				transform: translate3d(30px, 0, 0) rotate(180deg)
		.cart-count
			display: inline-block
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			vertical-align: top
			font-size: 10px
			color: rgb(147, 153, 159)	
</style>