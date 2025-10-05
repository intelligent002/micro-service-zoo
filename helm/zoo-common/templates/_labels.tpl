{{- define "zoo-common.labels" -}}
app.kubernetes.io/name: {{ include "zoo-common.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ include "zoo-common.chart" . }}
{{- end }}

{{- define "zoo-common.selectorLabels" -}}
app.kubernetes.io/name: {{ include "zoo-common.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
