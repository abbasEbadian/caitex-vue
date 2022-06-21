<script>
import { reactive, ref, watch, h } from "vue";
import { deposit, get_pair_price, profile, withdraw, assets } from "../api";
import { InputNumber, Form, FormItem, Button, Space, Collapse, notification, Spin, Input } from 'ant-design-vue';



export default {
	inject:[ "BASE_URL" ],  
	components: {
		InputNumber,
		AForm: Form,
		AInput: Input,
		AFormItem: FormItem,
		AButton: Button,
		ASpace: Space,
		ACollapse: Collapse,
		ASpin: Spin
	},
	data() {
		return {
			user: {},
			loading: false,
			pair_loading: false,
			currencies: [{ label: "LiteCoin Testnet", value: "litecointestnet" }],
			rawCurrencies: []

		}
	},
	methods: {
		_deposit() {
			this.loading = true;
			const storageValue = {
				amount: this.formState.amount,
				currency: this.formState.currency,
				url: "",
				id: "",
				status: "new",
				type: "Deposit"
			}
			deposit({ ...storageValue, test: this.formState.test }).then(e => {
				storageValue.url = e.url
				storageValue.id = e.id
				if (e.error !== 1 && e.url && e.url.length > 0) {

					this.openNotificationWithIcon("success", "Success!", "Redirecting...")
					window.open(e.url, "_self")
				} else {
					this.openNotificationWithIcon("error", e.message, e.extra)
				}
			}).catch(e => {
				console.log(e)
			})
			.finally(f => {
				this.loading = false
			})
		},
		_withdraw() {
			this.loading = true;
			const storageValue = {
				amount: this.formState.amount,
				currency: this.formState.currency,
				url: "",
				id: "",
				status: "new",
				type: "Withdraw",
				address: this.formState.withdrawAddress
			}
			withdraw({ ...storageValue, test: this.formState.test }).then(e => {
				// storageValue.url = e.url
				storageValue.id = e.id
				if (e.error !== 1 ) {

					this.openNotificationWithIcon("success", "Success!", "Payout queued !")
					profile().then(user => this.user = user)
					// window.open(e.url, "_self")
				} else {
					this.openNotificationWithIcon("error", e.message, e.extra)
				}
			}).catch(e => {
				console.log(e)
			})
			.finally(f => {
				this.loading = false
			})
		},
		signout(){
			localStorage.removeItem("token");
			window.location.reload()
		}
	},
	watch: {
		
		'formState.currency'(newVal){
			this.pair =  "USD_" + this.rawCurrencies.find(i=>i.alfaname === newVal).symbol 
			this.pair_loading = true
			get_pair_price(this.pair).then(e => {
				if (e.error !== 1) {
					this.pair_value =  e.price 
				} else {
					this.price_value= 0
				}
			}).catch(e => {
				console.log(e)
			})
			.finally(e=>{
				this.pair_loading = false
			})
		}

	},
	setup() {
		const pair = ref("USD_LTCT")
		const pair_value = ref(0)
		const formState = reactive({
			amount: 1,
			currency: "",
			test: 0,
			action:"deposit",
			withdrawAddress: ""
		});

		const onFinish = values => {
			console.log('Success:', values);
		};

		const onFinishFailed = errorInfo => {
			console.log('Failed:', errorInfo);
		};
		const handleChange = (value) => {
			formState.currency = value;
		};
		const activeKey = ref(['0']);
		const activeKey2= ref(['0']);
		
		
		const openNotificationWithIcon = (type, message, description) => {
			notification[type]({
				message,
				description,
			});
		};
		
		return {
			formState,
			onFinish,
			onFinishFailed,
			handleChange,
			activeKey,
			activeKey2,
			openNotificationWithIcon,
			pair,
			pair_value,
		};
	},
	mounted() {
		
		profile().then(user => this.user = user)
		assets().then(assets => {
			const c = assets.map(item=>({label: item.name, value: item.alfaname}))
			this.currencies = c
			this.rawCurrencies = assets
			this.formState.currency = c[0].value
		})

		.catch(e => console.log(e))
		this.pair_loading = true
		get_pair_price(this.pair).then(e => {
			if (e.error !== 1) {
				this.pair_value =  e.price 
			} else {
				this.price_value= 0
			}
		}).catch(e => {
			console.log(e)
		})
		.finally(e=>{
			this.pair_loading = false
		})
	}
}
</script>

<template>
<main class="row">
	<div class="col-12 col-lg-9">
		<section class="grid col-12 col-lg-6 col-md-8 mx-auto">
		<h1>caitex</h1>

		<div class="form">

			<a-form action="" layout="vertical">
				<a-form-item name="amount">
					<a-radio-group v-model:value="formState.action" style="width: 100%">
						<a-radio-button value="deposit">Deposit</a-radio-button>
						<a-radio-button value="withdraw">Withdraw</a-radio-button>
					</a-radio-group>
				</a-form-item>

				<!-- <a-form-item name="amount">
					<a-radio-group v-model:value="formState.test" style="width: 100%">
						<a-radio-button :value="1">Test</a-radio-button>
						<a-radio-button :value="0">Real</a-radio-button>
					</a-radio-group>
				</a-form-item> -->

				<a-form-item label="Currency" name="currency" :rules="[{ required: false }]">
					<a-select ref="select" v-model:value="formState.currency" :options="currencies">

					</a-select>
				</a-form-item>
				<a-form-item :label="'Amount in usd'" name="amount"
					:rules="[{ required: false, message: 'Please input your Amount!' }]">
					<input-number style="width: 100%" :precision="2" :step="0.1" v-model:value="formState.amount">
					<template #addonAfter >
						<span v-if="!pair_loading">
							≈ {{ Number(+pair_value * formState.amount).toFixed(4) }} 
						</span>
						<template v-else>
							<a-spin  size="small"/>
						</template>
					</template>
					</input-number>
				</a-form-item>
				<a-form-item :label="'Wallet address'" name="amount" v-if="formState.action === 'withdraw'"
					>
					<a-input style="width: 100%"  v-model:value="formState.withdrawAddress">
					</a-input>
				</a-form-item>



				<a-button html-type="submit" type="primary" @click="_deposit" :loading="loading" v-if="formState.action === 'deposit'">Pay</a-button>
				<a-button html-type="submit" type="primary" @click="_withdraw" :loading="loading" v-else>Withdraw</a-button>
			</a-form>


		</div>
	</section>
	</div>
	<div class="col-12 col-lg-3 mt-5 mt-lg-0">
		<h3>{{ user?.username }}</h3>
		<a @click="signout" href="#signout">signout</a>
		<hr>
		<br>
		<div >
			Deposits:
			<a-collapse v-model:activeKey="activeKey" accordion v-if="user?.depositrequest_set?.length > 0">
				<template v-for="(f, index) in user?.depositrequest_set" :key="index">
					<a-collapse-panel :key="index + 1" :header="f.amount + ' ' + f.currency"
						v-if="f.amount !== 'undefined'">
						<a :href="f.url"> Payment link </a>
					</a-collapse-panel>
				</template>
			</a-collapse>
			<span v-else><hr> No deposits yet</span>

		</div>
		<br>
		<br>
		<div class="mt-5">
			Withdraws:
			<a-collapse v-model:activeKey="activeKey2" accordion v-if="user?.withdrawrequest_set?.length > 0">
				<template v-for="(f, index) in user?.withdrawrequest_set" :key="index">
					<a-collapse-panel :key="index + 1" :header=" f.manupulated_amount + ' ' + f.currency"
						v-if="f.amount !== 'undefined'">
						Status: {{ f.status }}
					</a-collapse-panel>
				</template>
			</a-collapse>
			<span v-else><hr> No withdraws yet</span>

		</div>
	</div>
</main>
	
</template>

<style>
#app {
	/* display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: 64px; */
	padding: 32px;
	padding-top: 128px;
}

.ant-form label {
	font-size: 14px;
	width: 50%;
	text-align: center;
}

.ant-form-item-label {
	white-space: nowrap !important;

}
.ant-input-number-group-addon{
	min-width: 65px;
}
section.grid {

	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: auto;
	border: 1px solid #ddd;
	padding: 16px;
	border-radius: 12px;
}

h1 {
	font-family: 'Luckiest Guy', cursive;
	text-transform: uppercase;
	font-size: 84px;
	letter-spacing: 0.5rem;
	margin-bottom: 128px;
}

.ant-form-item-label>label {
	padding-bottom: 0;
}

select {
	padding: 8px 16px;
	min-width: 300px;
}

label {
	padding-bottom: 16px;
	display: block;
}

button {
	width: 100%;
	margin-top: 16px;
	border: 1px solid #ddd;
	background-color: crimson;
	color: white;
	padding-block: 8px;
	cursor: pointer;
}
.form{
	max-width: 100%;
}
</style>
