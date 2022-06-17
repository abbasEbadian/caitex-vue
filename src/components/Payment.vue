<script>
import { reactive, ref, watch, h } from "vue";
import { deposit, get_pair_price } from "../api";
import { InputNumber, Form, FormItem, Button, Space, Collapse, notification, Spin } from 'ant-design-vue';


const symbols = {
	"bitcoin": "BTC",
	"ethereum": "ETH",
	"xrp": "XRP",
	"bitcoincash": "BCH",
	"litecoin": "LTC",
	"dash": "DASH",
	"tron": "TRX",
	"litecointestnet": "LTCT",
}
export default {
	components: {
		InputNumber,
		AForm: Form,
		AFormItem: FormItem,
		AButton: Button,
		ASpace: Space,
		ACollapse: Collapse,
		ASpin: Spin
	},
	data() {
		return {
			loading: false,
			pair_loading: false,
			currencies: [{ label: "LiteCoin Testnet", value: "litecointestnet" }]
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
				status: "new"
			}
			deposit({ ...storageValue, test: this.formState.test }).then(e => {
				storageValue.url = e.url
				storageValue.id = e.id
				if (e.error !== 1 && e.url && e.url.length > 0) {

					this.openNotificationWithIcon("success", "Success!", "Redirecting...")
					localStorage.setItem("invoices", JSON.stringify([...this.invoices, storageValue]))
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
		}
	},
	watch: {
		'formState.test'(newVal) {
			this.currencies = !newVal ? [
				{ label: "Bitcoin", value: "bitcoin" },
				{ label: "Ethereum", value: "ethereum" },
				{ label: "XRP", value: "xrp" },
				{ label: "Bitcoin Cash", value: "bitcoincash" },
				{ label: "Litecoin", value: "litecoin" },
				{ label: "DASH", value: "dash" },
				{ label: "TRON", value: "tron" },
			] : [{ label: "LiteCoin Testnet", value: "litecointestnet" }]
			this.formState.currency = !newVal ? "bitcoin" : "litecointestnet"
			this.pair = symbols[!newVal ? "bitcoin" : "litecointestnet"] + "_USD"
		},
		'formState.currency'(newVal){
			this.pair =  "USD_" + symbols[newVal] 
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
			currency: "litecointestnet",
			test: 1
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
		
		const invoices = JSON.parse(localStorage.getItem('invoices') || "[]")
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
			invoices,
			activeKey,
			openNotificationWithIcon,
			pair,
			pair_value
		};
	},
	mounted() {
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
	<section class="grid">
		<h1>caitex</h1>

		<div class="form">

			<a-form action="" layout="vertical">
				<a-form-item name="amount">
					<a-radio-group v-model:value="formState.test" style="width: 100%">
						<a-radio-button :value="1">Test</a-radio-button>
						<a-radio-button :value="0">Real</a-radio-button>
					</a-radio-group>
				</a-form-item>
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
				<a-form-item>
				</a-form-item>



				<a-button html-type="submit" type="primary" @click="_deposit" :loading="loading">Pay</a-button>
			</a-form>


		</div>
	</section>
	<div style="width: clamp(340px, 80%, 340px)">
		<br><br>
		History:
		<a-collapse v-model:activeKey="activeKey" accordion v-if="invoices.length > 0">
			<template v-for="(f, index) in invoices" :key="index">
				<a-collapse-panel :key="index + 1" :header="'Deposit ' + f.amount + ' ' + f.currency"
					v-if="f.amount !== 'undefined'">
					<a :href="f.url"> Payment link </a>
				</a-collapse-panel>
			</template>
		</a-collapse>
		<span v-else><hr> No transactions yet</span>

	</div>
</template>

<style>
#app {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-block: 128px;
	margin-bottom: 64px;
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
	margin-top: 128px;
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
	min-width: 300px;
	margin-top: 16px;
	border: 1px solid #ddd;
	background-color: crimson;
	color: white;
	padding-block: 8px;
	cursor: pointer;
}
</style>
