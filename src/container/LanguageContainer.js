import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { GET_LIST } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import dataProvider from '../core/dataProvider';
import { getValue, setValue, CONFIG_LOCALE, CONFIG_THEME_DIR } from '../core/configProvider';

const LANG_API = 'setting/systemlanguages';

const styles = theme => ({
  languageContainer: {
    paddingTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  IconButton: {
    padding: '8px 12px',
    margin: '0 5px',
  },

  selectLang: {
    color: theme.palette.secondary.main,
  },
});

const LanguageContainer = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [languageList, setLanguageList] = useState([]);
  const { classes } = props;
  const currentLocale = getValue(CONFIG_LOCALE);

  useEffect(() => {
    setIsLoading(true);

    // use effect must only return function to cleanup, if async is used, it will give back a promise
    // so define a function here and call it immidiately
    async function fetchData() {
      const { data } = await dataProvider(GET_LIST, LANG_API, {
        pagination: {
          page: 1,
          perPage: 1000,
        },
        sort: {
          field: 'id',
          order: 'ASC',
        },
        skipPrefix: true,
      });

      setIsLoading(false);
      setLanguageList(data);
    }

    fetchData();
  }, []);

  const handleChangeLocale = row => {
    setValue(CONFIG_LOCALE, row.keyword);
    setValue(CONFIG_THEME_DIR, row.textDirection);

    window.location.reload();
  };

  return (
    <div className={classes.languageContainer} id="lang">
      {isLoading && <CircularProgress color="secondary" />}
      {languageList &&
        languageList.map(row => (
          <Tooltip key={row.keyword} title={row.title}>
            <IconButton
              className={classes.IconButton}
              onClick={() => handleChangeLocale(row)}
              data-test={`lang-${row.keyword}`}
            >
              <Typography
                className={classNames({
                  [classes.selectLang]: currentLocale === row.keyword,
                  [`lang-${row.keyword}`]: true,
                })}
                variant="body2"
              >
                {row.keyword}
              </Typography>
            </IconButton>
          </Tooltip>
        ))}
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(LanguageContainer);
