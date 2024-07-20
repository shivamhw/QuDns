import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { listDomain } from '../../../types/ddns';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useUser } from '@clerk/clerk-react';
import { UserContext } from '../App';
import Resutls from './Results';
import { result } from './Results';
import { BootstrapInput } from '../styles/componant_styles';
import { Typography } from '@mui/material';


export default function CustomizedSelects() {
  const [subdomain, setSubDomain] = React.useState("");
  const [rootdomain, setRootDomain] = React.useState<listDomain>({
    rootDnsName: "",
    zone_id: "",
    id: ""
  })
  const [domains, setDomains] = React.useState<listDomain[]>([]);
  const [result, setResult] = React.useState<result>()
  const [err, setErr] = React.useState<boolean>(false);
  const userContext = React.useContext(UserContext);
  const { isLoaded, isSignedIn } = useUser();
  const ddns = userContext.ddnsClient

  React.useEffect(() => {
    const updater = async () => {
      try{
      const r = await ddns?.listDomains()
      setDomains(r || [])
    }
    catch(err){
      console.log("setting domain failed")
      setErr(true)
    }
    }
    updater()
    if(isSignedIn){
      setErr(false)
    }
  }, [isLoaded, isSignedIn])

  const handleChange = (e) => {
    const d = domains.find((item) => {
      return item.rootDnsName == e.target.value;
    })
    if (d != undefined) {
      setRootDomain(d);
    }
  };

  if (!ddns) {
    return <Typography variant='h3' color='error'>backend connectivity failed :(</Typography> 
  }
  if (err) {
    return <Typography variant='h3' color='error'>Something went wrong :( Try to relogin or refresh. </Typography> 
  }
  return (
    <Stack
      sx={{
        maxWidth: '600px',
        minWidth: { md: '500px', xs: '350px', sm: '400px' }
      }}>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="demo-customized-textbox">SubDomain</InputLabel>
        <BootstrapInput onChange={(e) => {
          console.log(e.target)
          setSubDomain(e.target.value);
        }} id="demo-customized-textbox" />
      </FormControl>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel id="demo-customized-select-label">RootDomain</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={rootdomain.rootDnsName}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
  {
            domains &&
            domains.length > 0 &&
            domains.map((rec) => {
              return <MenuItem key={rec.id} value={rec.rootDnsName}>{rec.rootDnsName}</MenuItem>
            })
          
}

        </Select>
      </FormControl>
      <LoadingButton sx={{ m: 1 }} loading={false} onClick={async () => {
        console.log("submit for search ", subdomain, rootdomain);
        const r = await ddns.checkAvailability(subdomain, rootdomain?.rootDnsName);
        console.log("r ", r)
        setResult({
          subdomain: subdomain,
          rootdomain: rootdomain.rootDnsName,
          isAvailable: r,
          zone_id: rootdomain.zone_id || ""
        })
      }} loadingIndicator="Loading…" variant="outlined">
        Check Availability
      </LoadingButton>
      {result && <Resutls result={result}></Resutls>}
    </Stack>
  );
}