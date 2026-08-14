<template>
  <footer class="landing-footer">
    <div class="landing-container">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-sm">
          <div class="text-h6 text-weight-bold">DocIntel</div>

          <div class="text-grey-5 q-mt-xs">
            AI-powered document intelligence.
          </div>
        </div>

        <div class="col-12 col-sm-auto">
          <div class="row q-gutter-sm">
            <q-btn
              flat
              no-caps
              color="grey-4"
              label="Features"
              href="#features"
            />

            <q-btn
              flat
              no-caps
              color="grey-4"
              label="How it works"
              href="#how-it-works"
            />

            <q-btn
              flat
              no-caps
              color="grey-4"
              label="Security"
              href="#security"
            />
          </div>
        </div>
      </div>

      <q-separator dark class="q-my-lg" />

      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-sm-auto text-grey-6 text-caption">
          © {{ new Date().getFullYear() }} DocIntel
        </div>

        <div class="col-12 col-sm-auto row items-center q-gutter-sm">
          <span class="text-grey-5 text-caption">
            Developed by
            <strong class="text-white">Arsam</strong>
          </span>

          <q-btn
            flat
            round
            dense
            icon="code"
            color="grey-4"
            href="https://github.com/fatdarkness6"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Arsam on GitHub"
          >
            <q-tooltip> GitHub </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.landing-footer {
  padding: 56px 0;
  background: #101828;
  color: white;
}
</style>
