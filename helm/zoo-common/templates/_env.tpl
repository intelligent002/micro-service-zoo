{{- define "zoo-common.env" -}}
{{- $chartTemplate := printf "%s.env_template" .Chart.Name -}}
{{- $extraEnv := (include $chartTemplate . | default "" | trim) -}}
{{- if or .Values.env .Values.extraEnv $extraEnv }}
env:
{{- if .Values.env }}
{{- range $k, $v := .Values.env }}
  - name: {{ $k }}
    value: {{ $v | quote }}
{{- end }}
{{- end }}

{{- if .Values.extraEnv }}
{{- range .Values.extraEnv }}
  - name: {{ .name }}
    {{- if hasKey . "valueFrom" }}
    valueFrom:
      {{- if and (hasKey .valueFrom "secretKeyRef") (hasKey .valueFrom.secretKeyRef "key") }}
      secretKeyRef:
        # Prefer the provided name; fallback to your DB secret helper if absent
        name: {{ default .valueFrom.secretKeyRef.name (include "zoo-common.zoo-db-SecretName" $) }}
        key: {{ .valueFrom.secretKeyRef.key }}
      {{- else }}
      {{- toYaml .valueFrom | nindent 6 }}
      {{- end }}
    {{- else if hasKey . "value" }}
    value: {{ .value | quote }}
    {{- end }}
{{- end }}
{{- end }}
{{- if $extraEnv }}
{{ tpl $extraEnv . | nindent 2 }}
{{- end }}
{{- end }}
{{- end }}
