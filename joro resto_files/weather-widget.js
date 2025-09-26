function refresh_weather_data(){
  jQuery.get('/wp-content/plugins/tdc_pull_weather_data/tdc_weather_data.php', function(data) {
    jQuery('.weather_widget .tideLevelValue').html(data.tideLevel);
    jQuery('.weather_widget .windSpeedCurrentValue').html(data.windSpeed);
    jQuery('.weather_widget .windSpeedGustsValue').html(data.windGusts);
    jQuery('.weather_widget .windDirectionValue').html(data.windDirection);
    jQuery('.weather_widget .temperatureValue').html(data.temperatureC + '°C');
    jQuery('.weather_widget .humidityValue').html(data.humidity + '%');
	  //jQuery('.weather_widget .date-time').html(data.timestamp);
  }, 'json');

  url = '/wp-content/plugins/tdc_tidal_chart_svg/tidal_chart.svg?t=' + (new Date()).getTime();
  jQuery('.weather_widget .tideChartInner').attr('src', url);

  phaseIndex = Math.round(SunCalc.getMoonIllumination().phase/0.125);
  phases = ['new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous', 'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent'];
  jQuery('.weather_widget .moonPhaseValueInner').removeClass('new_moon').removeClass('waxing_crescent').removeClass('first_quarter').removeClass('waxing_gibbous').removeClass('full_moon').removeClass('waning_gibbous').removeClass('last_quarter').removeClass('waning_crescent').addClass(phases[phaseIndex]);
}

jQuery(document).ready(function(){
  refresh_weather_data();
  setInterval(function(){
    refresh_weather_data();
  }, 60*1000);
})
