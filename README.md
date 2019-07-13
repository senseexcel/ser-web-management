# Sense Excel Reporting Web Management

Angular 8 App which could loaded as extension (mashup) into Qlik Qrs to manage ser reports.

## Install

- requires
  - nodejs (9+) latest version is currently 10.16 (stable)

- clone repository:

```bash
# with ssh (requires registered ssh key in github)
git clone git@github.com:senseexcel/ser-web-management.git

# with https
git clone https://github.com/senseexcel/ser-web-management.git
```

Go into directory and install required dependencies

```bash
cd ser-web-manangement
npm i
```

build mashup (this could take a while)

```bash
npm run build
```

after build has been finished a zip file will created which could imported to qrs/extensions, this file could found under
**./dist/ser-web-management.zip** and could imported into qrs.
