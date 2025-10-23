import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';

import { formatNumber } from '@platform/shared';

const mockKpis = [
  { label: 'Active Patients', value: 1324 },
  { label: 'Bed Occupancy', value: 87, suffix: '%' },
  { label: 'Avg. Wait Time', value: 12, suffix: ' mins' },
];

export default function HomePage() {
  return (
    <Flex direction="column" minH="100vh">
      <Box as="header" bg="brand.500" py={12} color="white">
        <Flex maxW="6xl" mx="auto" px={6} align="center" justify="space-between">
          <Box>
            <Heading size="xl" mb={2}>
              Platform Analytics Dashboard
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.800">
              Real-time insights across clinical, operational, and financial data.
            </Text>
          </Box>
          <Button colorScheme="whiteAlpha" variant="solid" size="lg">
            View Docs
          </Button>
        </Flex>
      </Box>
      <Box as="main" flex="1" py={16}>
        <Stack spacing={10} maxW="6xl" mx="auto" px={6}>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
            {mockKpis.map((kpi) => (
              <Box key={kpi.label} flex="1" bg="white" borderRadius="lg" boxShadow="md" p={6}>
                <Text fontSize="sm" color="gray.500">
                  {kpi.label}
                </Text>
                <Heading size="lg">
                  {formatNumber(kpi.value)}
                  {kpi.suffix ?? ''}
                </Heading>
              </Box>
            ))}
          </Stack>
          <Box bg="white" borderRadius="lg" boxShadow="md" p={8}>
            <Heading size="md" mb={4}>
              Unified Monitoring
            </Heading>
            <Text color="gray.600">
              Integrate the backend analytics APIs to unlock comprehensive reports, alerts,
              and workflow automation. Shared design tokens ensure consistency across web
              and service UIs.
            </Text>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}
