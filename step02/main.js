const fnameutils=require('./nodemodule');

const fnames = [ 'a.csv', 'b.txt', 'c.xls' ];

const length=fnames.length;

for (let i=0;i<length;i++) {
    let iscsv=fnameutils.iscsv(fnames[i]);
    let istxt=fnameutils.istxt(fnames[i]);
    console.log('Filename : '+fnames[i]+' istxt='+istxt+'\t iscsv='+iscsv);
}


