import bunyan from 'bunyan';
import configuration from './configuration';

const log = bunyan.createLogger({
    name: configuration.logs.name,
    streams: configuration.logs.streams,
});

export default log;
