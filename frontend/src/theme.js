
import { createMuiTheme } from '@material-ui/core/styles';
import { blueGrey, pink } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: blueGrey,
  },
  status: {
    danger: 'yellow',
  },
});
export default theme
