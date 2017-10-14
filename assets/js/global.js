import React from 'react';
import ReactDOM from 'react-dom';
let apikey = 'be595f09020ba0ccab2bbfcedebc2b54';
let rememberedList = localStorage.rememberedList ? localStorage.getItem('rememberedList').split(',') : ['Kharkiv','Kiev'];



class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cities: rememberedList,
			city: null,
			selectedCity: null,
			msg: null
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.getCity = this.getCity.bind(this);
		this.removeCity = this.removeCity.bind(this);
	}
	componentWillMount() {
		this.getCity(this.state.cities[0]);
	}
	componentDidUpdate(prevState) {
		if(prevState.cities !== this.state.cities) {
			localStorage.setItem('rememberedList', this.state.cities);
		}
	}
	checkCity(insertedCity, returnedCity) {
		return insertedCity.toLowerCase() === returnedCity.toLowerCase();
	}
	checkDoubles(givenCity) {
		return this.state.cities.some(city => city.toLowerCase() === givenCity.toLowerCase());
	}
	getCity(city, e) {
		if(e !== undefined) e.preventDefault();
		$.getJSON(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}&units=metric`, res => {
			if(res.cod === 401) {
				console.log('City not found');
			} else if(res.cod = 200) {
				if(e !== undefined) {
					this.setState({
						city: res,
						selectedCity: city,
						msg: null
					});
				} else {
					if(this.checkCity(city, res.name)) {
						if(this.checkDoubles(res.name)) {
							this.setState({
								city: res,
								selectedCity: res.name,
								msg: null
							});
						} else {
							this.setState({
								cities: [...this.state.cities, res.name],
								city: res,
								selectedCity: res.name,
								msg: null
							});
						}
					} else {
						this.setState({msg: 'Invalid city name'});
					}
				}
			} else {
				console.log('Unknown error');
			}
		});
	}
	removeCity(city, e) {
		e.preventDefault();
		let filteredCities = this.state.cities.filter(item => item !== city);
		if(city !== this.state.selectedCity) {
			this.setState({cities: filteredCities});
		} else {
			if(filteredCities.length === 0) {
				this.setState({
					cities: filteredCities,
					city: null,
					selectedCity: null
				});
			} else {
				this.setState({cities: filteredCities});
				this.getCity(this.state.cities[0],e);
			}
		}
	}
	handleSubmit(e) {
		e.preventDefault();
		this.getCity(this.textInput.value);
		this.textInput.value = '';
	}
	render() {

		let msg;
		if(this.state.msg) {
			msg = <div className="msg">{this.state.msg}</div>
		}

		let cities = this.state.cities.map((city,i)=> {
			return <Button selected={this.state.selectedCity} key={i} city={city} select={this.getCity} remove={this.removeCity} />
		});

		return (
			<div>
				<Form value={input => {this.textInput = input}} submitHandler={this.handleSubmit} />
				{msg}
				{this.state.cities.length > 0 && <ul className="list">{cities}</ul>}
				{this.state.city && <Info city={this.state.city} />}
			</div>
		);
	}
}



const Form = ({submitHandler, value}) => (
	<form className="location-form" onSubmit={submitHandler}>
		<input type="text" ref={value} />
		<input type="submit" />
	</form>
);



const Info = ({city}) => {
	let imgUrl = `http://openweathermap.org/img/w/${city.weather[0].icon}.png`;
	let rotate = {
		transform: `rotate(${city.wind.deg}deg)`
	}
	return (
		<div className="info">
			<h3>{city.name}, {city.sys.country}</h3>
			<div className="weather"><img src={imgUrl} /> {city.weather[0].description}</div>
			<div>Currently: <strong>{city.main.temp}&#8451;</strong></div>
			<div>Wind: <strong>{city.wind.speed} m/s</strong> <span className="winddirection" style={rotate}></span></div>
		</div>
	)
};



const Button = ({city, selected, select, remove}) => {
	selected = selected === city ? 'selected' : null;
	return (
		<li className={selected}>
			<a onClick={(e) => select(city, e)} href="#">{city}</a>
			<a onClick={(e) => remove(city, e)} href="#">x</a>
		</li>
	);
}



ReactDOM.render(
	<App />,
	document.querySelector('#app')
);


