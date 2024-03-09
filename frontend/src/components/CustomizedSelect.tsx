import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { listDomain } from '../../../types/ddns';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import {  useUser } from '@clerk/clerk-react';
import { UserContext } from '../App';
import Resutls from './Results';
import { result } from './Results';
import { BootstrapInput } from '../styles/componant_styles';


export default function CustomizedSelects() {
  const [subdomain, setSubDomain] = React.useState("");
  const [rootdomain, setRootDomain] = React.useState<listDomain>({
    rootDnsName: "",
    zone_id: "",
    id: ""
  })
  const [domains, setDomains] =  React.useState<listDomain[]>([]);
  const [result, setResult] = React.useState<result>()
  const userContext = React.useContext(UserContext);
  const { isLoaded } = useUser();
  const ddns = userContext.ddnsClient

  React.useEffect(() => {
     const updater = async () =>  {
      const r = await ddns?.listDomains()
      setDomains(r || [])
     }
    updater()
  },[isLoaded])

  const handleChange = (e ) => {
    const d = domains.find((item ) => {
      return item.rootDnsName == e.target.value;
    })
    if(d != undefined){
      setRootDomain(d);
    }
  };

  if(!ddns){
    return "backend connectivity failed"
  }
  return (
        <Stack 
        sx={{
            maxWidth : '600px',
            minWidth : '500px'
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
            domains.map((rec) => {
                return <MenuItem key={rec.id} value={rec.rootDnsName}>{ rec.rootDnsName }</MenuItem>
            })
          }
          
        </Select>
      </FormControl>
      <LoadingButton sx={{ m: 1 }} loading={false} onClick={ async ()=>{
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
     { result && <Resutls result={result}></Resutls>}
      </Stack>
  );
}